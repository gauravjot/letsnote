import { Editor, Transforms } from "slate";
import { useCallback, useState } from "react";
import { useSlateStatic } from "slate-react";

import isHotkey from "is-hotkey";

const Image = ({ attributes, children, element }: any) => {
	const [isEditingCaption, setEditingCaption] = useState(false);
	const [caption, setCaption] = useState(element.caption);
	const editor = useSlateStatic();

	const applyCaptionChange = useCallback(
		(captionInput: any) => {
			const imageNodeEntry = Editor.above(editor, {
				match: (n: any) => n.type === "image",
			});
			if (imageNodeEntry == null) {
				return;
			}

			if (captionInput != null) {
				setCaption(captionInput);
			}

			Transforms.setNodes(editor, {}, { at: imageNodeEntry[1] });
		},
		[editor, setCaption]
	);

	const onCaptionChange = useCallback(
		(event: any) => {
			setCaption(event.target.value);
		},
		[setCaption]
	);

	const onKeyDown = useCallback(
		(event: any) => {
			if (!isHotkey("enter", event)) {
				return;
			}
			event.preventDefault();

			applyCaptionChange(event.target.value);
			setEditingCaption(false);
		},
		[applyCaptionChange, setEditingCaption]
	);

	const onToggleCaptionEditMode = useCallback(() => {
		const wasEditing = isEditingCaption;
		setEditingCaption(!isEditingCaption);
		wasEditing && applyCaptionChange(caption);
	}, [isEditingCaption, applyCaptionChange, caption]);

	return (
		<div contentEditable={false} {...attributes}>
			<div>
				{!element.isUploading && element.url != null ? (
					<img src={String(element.url)} alt={caption} className={"image"} />
				) : (
					<div className={"image-upload-placeholder"}>
						<div />
					</div>
				)}
				{isEditingCaption ? (
					<div
						autoFocus={true}
						className={"image-caption-input"}
						defaultValue={caption}
						onKeyDown={onKeyDown}
						onChange={onCaptionChange}
						onBlur={onToggleCaptionEditMode}
					/>
				) : (
					<div
						className={"image-caption-read-mode"}
						onClick={onToggleCaptionEditMode}
					>
						{element.caption}
					</div>
				)}
			</div>
			{children}
		</div>
	);
};

export default Image;
