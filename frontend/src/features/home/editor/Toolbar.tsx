import {
	getActiveStyles,
	getTextBlockStyle,
	getTextAlignStyle,
	hasActiveLinkAtSelection,
	toggleBlockType,
	toggleLinkAtSelection,
	toggleStyle,
} from "./EditorUtils";

import React, {useCallback, useContext} from "react";
import {useSlateStatic} from "slate-react";
import {timeSince} from "@/utils/DateTimeUtils";
import Button from "@/components/ui/button/Button";
import {NoteType} from "@/types/api";
import TitleUpdateDialog from "@/features/home/TitleUpdateDialog";
import {UserContext} from "@/App";

const PARAGRAPH_STYLES = ["h1", "h2", "h3", "h4", "codeblock", "quote", "ul", "ol"];
const CHARACTER_STYLES = [
	"bold",
	"italic",
	"underline",
	"highlight",
	"code",
	"strike",
	"sup",
	"sub",
];
const TEXT_ALIGN = ["left", "center", "right", "justify"];

function Toolbar({note}: {note: NoteType | null}) {
	const editor = useSlateStatic();
	const userToken = useContext(UserContext).user;
	const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false);

	const onBlockTypeChange = useCallback(
		(targetType: string) => {
			if (targetType === "multiple") {
				return;
			}
			toggleBlockType(editor, targetType);
		},
		[editor]
	);

	const blockType = getTextBlockStyle(editor);

	const closeEditNameDialog = () => setIsRenameDialogOpen(false);

	return (
		<>
			{isRenameDialogOpen && note && userToken && (
				<div className="fixed inset-0 z-[100] print:hidden">
					<div className="fixed inset-0 bg-black/30 z-0" onClick={closeEditNameDialog}></div>
					<div className="fixed inset-0 flex place-items-center justify-center z-[60]">
						<TitleUpdateDialog note={note} closeFn={closeEditNameDialog} />
					</div>
				</div>
			)}
			<div className="top-0 z-30 sticky print:hidden" id="toolbar">
				<div className="bg-gray-50 px-1 mt-1 shadow-md rounded ab-toolbar">
					<div className="px-3 pt-1 ml-1 flex gap-2 place-items-center">
						<div className="flex-1 flex gap-2 place-items-center">
							<span className="text-lg font-serif font-medium truncate">
								{note ? note.title : "Untitled"}
							</span>
							{note && (
								<Button
									elementChildren="Rename"
									elementIcon="edit"
									elementIconOnly={true}
									elementType="button"
									elementState="default"
									elementStyle="white_no_border"
									elementSize="xsmall"
									onClick={() => {
										setTimeout(() => {
											document?.getElementById("editnotename")?.focus();
										}, 100);
										setIsRenameDialogOpen(true);
									}}
								/>
							)}
							<span className="text-xs text-gray-500 align-middle block">
								{note ? `(modified ${timeSince(note.updated)})` : ""}
							</span>
						</div>
						<div className="flex place-items-center gap-2">
							<span className="font-medium text-sm">Zoom</span>
							<div className="zoomslidecontainer flex place-items-center">
								<input
									type="range"
									min="2"
									max="5"
									step="0.25"
									defaultValue="3"
									className="zoomslider"
									id="myRange"
									onInput={(e) => {
										let zoomValue: string | number = (e.target as HTMLInputElement).value;
										if (zoomValue !== "") {
											zoomValue = parseFloat(zoomValue);
										}
										zoomValue = ((zoomValue as number) / 3) * 16;
										console.log(zoomValue);
										document
											.getElementById("editor")
											?.style.setProperty("font-size", `${zoomValue}px`);
									}}
								/>
							</div>
						</div>
					</div>
					<div className="pb-2 line-height-150 space-y-1">
						{/* Dropdown for paragraph styles */}
						<div className="border-r-2 border-gray-300 pr-3 inline-block">
							<ElementSelect
								title={getLabelForBlockStyle(blockType ?? "paragraph")}
								elements={PARAGRAPH_STYLES}
								onSelect={onBlockTypeChange}
							/>
						</div>

						{/* Buttons for character styles */}
						<div className="inline-block">
							<div className="inline-block">
								{CHARACTER_STYLES.map((style) => (
									<ToolBarButton
										key={style}
										characterstyle={style}
										label={style}
										isActive={getActiveStyles(editor).has(style)}
										onMouseDown={(event: MouseEvent) => {
											event.preventDefault();
											toggleStyle(editor, style);
										}}
									/>
								))}
							</div>
							{/* Link Button */}
							<div className="border-r-2 border-gray-300 inline-block pr-3">
								<ToolBarButton
									isActive={hasActiveLinkAtSelection(editor)}
									label={"link"}
									onMouseDown={() => toggleLinkAtSelection(editor)}
								/>
							</div>

							{/* Image Upload Button
          <label
            className="ml-3 p-1 text-xs rounded aspect-square cursor-pointer"
            htmlFor="image-upload"
          >
            <span
              className={
                "ic ic-md ic-black align-middle " + getIconForButton("image")
              }
            ></span>
          </label>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={onImageSelected}
          />
          */}
						</div>
						{/* Options for text Alignment */}
						<div className="pr-3 inline-block">
							<ElementSelect
								title={getLabelForBlockStyle(getTextAlignStyle(editor) ?? "paragraph")}
								elements={TEXT_ALIGN}
								onSelect={onBlockTypeChange}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export const EditorToolbar = React.memo(Toolbar, (prevProps, nextProps) => {
	return (
		prevProps.note?.id === nextProps.note?.id &&
		prevProps.note?.title === nextProps.note?.title &&
		prevProps.note?.updated === nextProps.note?.updated
	);
});

// Text Formatting
function ToolBarButton(props: any) {
	const {label, isActive, ...otherProps} = props;
	return (
		<button
			variant=""
			className={
				(isActive ? "bg-gray-300 hover:outline outline-1 outline-gray-400 " : "hover:bg-gray-300") +
				" infotrig ml-3 p-1 text-xs aspect-square"
			}
			active={isActive ? "true" : "false"}
			{...otherProps}
		>
			<span
				className={
					(isActive ? "ic-black " : "ic-gray-50 ") + "ic-md align-middle " + getIconForButton(label)
				}
			></span>
			<div className="infomsg mt-3 z-30 whitespace-nowrap">{getTitleForTool(label)}</div>
		</button>
	);
}

function getIconForButton(style: string) {
	switch (style) {
		case "bold":
			return "ic-b";
		case "italic":
			return "ic-i";
		case "code":
			return "ic-inline-code";
		case "underline":
			return "ic-u";
		case "highlight":
			return "ic-highlight";
		case "strike":
			return "ic-strikethrough";
		case "sub":
			return "ic-substr";
		case "sup":
			return "ic-supstr";
		case "image":
			return "ic-add-photo";
		case "link":
			return "ic-link";
		default:
			return "ic";
	}
}

function getTitleForTool(tool: string) {
	switch (tool) {
		case "bold":
			return "Bold";
		case "italic":
			return "Italic";
		case "code":
			return "Inline Code";
		case "underline":
			return "Underline";
		case "highlight":
			return "Text Highlight";
		case "strike":
			return "Text Strikethrough";
		case "sub":
			return "Subscript";
		case "sup":
			return "Superscript";
		case "image":
			return "Add Image";
		case "link":
			return "Add Link";
		default:
			return getLabelForBlockStyle(tool);
	}
}
// Element Select

function getLabelForBlockStyle(style: string) {
	switch (style) {
		case "h1":
			return "Heading 1";
		case "h2":
			return "Heading 2";
		case "h3":
			return "Heading 3";
		case "h4":
			return "Heading 4";
		case "paragraph":
			return "Paragraph";
		case "codeblock":
			return "Code Block";
		case "quote":
			return "Quotations";
		case "multiple":
			return "Multiple";
		case "left":
			return "Align Left";
		case "right":
			return "Align Right";
		case "center":
			return "Align Center";
		case "justify":
			return "Justify Block";
		case "ul":
			return "Unordered List";
		case "ol":
			return "Ordered List";
		default:
			throw new Error(`Unhandled style in getLabelForBlockStyle: ${style}`);
	}
}

function Element({element, title, onSelect}: any) {
	return (
		<button
			className={
				(title === getLabelForBlockStyle(element) ||
				element.align === getLabelForBlockStyle(element)
					? "bg-gray-300 hover:outline outline-1 outline-gray-400 "
					: "hover:bg-gray-300") + " infotrig ml-3 p-1 text-xs aspect-square"
			}
			onClick={() => {
				onSelect(element);
			}}
		>
			<span
				className={
					(title === getLabelForBlockStyle(element) ? "ic-black " : "ic-gray-50 ") +
					"ic-md align-middle ic-" +
					element
				}
			></span>
			<div className="infomsg mt-3 z-30 whitespace-nowrap">{getTitleForTool(element)}</div>
		</button>
	);
}

function ElementSelect(props: any) {
	const {elements, title, onSelect} = props;
	return (
		<div className="inline-block">
			{elements.map((element: any, index: number) => (
				<span key={index}>
					<Element element={element} title={title} onSelect={onSelect} />
				</span>
			))}
		</div>
	);
}
