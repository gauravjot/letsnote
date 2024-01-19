import {Editor, Node, Transforms} from "slate";
import {ReactEditor, useSlateStatic} from "slate-react";
import {useCallback, useEffect, useRef, useState} from "react";
import Button from "@/components/ui/button/Button";
import {set} from "lodash";

export default function LinkEditor({editorOffsets, selectionForLink}: any) {
	const linkEditorRef = useRef<HTMLDivElement>(null);
	const [saveBtnIcon, setSaveBtnIcon] = useState<"done" | "save">("save");
	const editor = useSlateStatic();
	const [node, path] = Editor.above(editor, {
		at: selectionForLink,
		match: (n: any) => n.type === "link",
	}) || [null, null];

	const [linkURL, setLinkURL] = useState((node as {url?: string})?.url);

	useEffect(() => {
		setLinkURL((node as {url?: string})?.url);
	}, [node]);

	const onLinkURLChange = useCallback(
		(event: any) => {
			setSaveBtnIcon("save");
			setLinkURL(event.target.value);
		},
		[setLinkURL]
	);

	const onApply = useCallback(() => {
		setSaveBtnIcon("done");
		let url = String(linkURL);
		if (!(url.includes("//") || url.includes("\\\\"))) {
			url = "http://" + url;
		}
		setLinkURL(url);

		// ...

		if (path !== null) {
			Transforms.setNodes(
				editor,
				{
					url: url as string,
				} as Partial<Node>,
				{at: path}
			);
		}
	}, [editor, linkURL, path]);

	useEffect(() => {
		const editorEl = linkEditorRef.current;
		if (editorEl == null || node == null || editorOffsets == null) {
			return;
		}

		// ...

		const linkDOMNode = ReactEditor.toDOMNode(editor as ReactEditor, node); // Cast editor as ReactEditor
		const {x: nodeX, height: nodeHeight, y: nodeY} = linkDOMNode.getBoundingClientRect();

		editorEl.style.display = "block";
		editorEl.style.top = `${nodeY + nodeHeight - editorOffsets.y}px`;
		editorEl.style.left = `${nodeX - editorOffsets.x}px`;
	}, [editor, editorOffsets.x, editorOffsets.y, node]);

	if (editorOffsets == null) {
		return null;
	}

	return (
		<div
			ref={linkEditorRef}
			className="absolute max-sm:left-4 z-20 bg-white shadow border border-solid border-gray-100 rounded-xl px-2 mt-2"
		>
			<div className="text-sm flex place-items-center">
				<Button
					elementChildren="Open in new"
					elementIcon="open-in-new"
					elementType="button"
					elementState="default"
					elementStyle="white_no_border"
					elementSize="xsmall"
					elementIconOnly={true}
					onClick={() => window.open(linkURL, "_blank")}
					elementDisabled={String(linkURL).length < 3}
				/>
				<input
					className="ml-2 my-2 mr-2 px-2 py-1 rounded bg-opacity-50 focus:outline-none active:outline-none focus-visible:outline-none bg-gray-200 focus-visible:bg-opacity-80 text-sm border"
					type="text"
					value={linkURL}
					placeholder="insert a link here"
					onChange={onLinkURLChange}
				/>
				<Button
					elementChildren="Apply"
					elementIcon={saveBtnIcon}
					elementType="button"
					elementState="default"
					elementStyle="white_no_border"
					elementSize="xsmall"
					elementIconSize="md"
					elementIconOnly={true}
					onClick={onApply}
					elementDisabled={String(linkURL).length < 3}
				/>
			</div>
		</div>
	);
}
