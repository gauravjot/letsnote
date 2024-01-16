import { Editor, Node, Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function LinkEditor({ editorOffsets, selectionForLink }: any) {
	const linkEditorRef = useRef<HTMLDivElement>(null);
	const editor = useSlateStatic();
	const [node, path] = Editor.above(editor, {
		at: selectionForLink,
		match: (n: any) => n.type === "link",
	}) || [null, null];

	const [linkURL, setLinkURL] = useState((node as { url?: string })?.url);

	useEffect(() => {
		setLinkURL((node as { url?: string })?.url);
	}, [node]);

	const onLinkURLChange = useCallback(
		(event: any) => {
			setLinkURL(event.target.value);
		},
		[setLinkURL]
	);

	const onApply = useCallback(() => {
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
				{ at: path }
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
		const {
			x: nodeX,
			height: nodeHeight,
			y: nodeY,
		} = linkDOMNode.getBoundingClientRect();

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
			className="absolute max-sm:left-4 z-20 bg-gray-100 shadow-lg border border-solid border-gray-300 rounded-xl px-2 mt-2"
		>
			<div className="text-sm">
				<a
					href={linkURL}
					target="_blank"
					rel="noreferrer"
					className={
						linkURL
							? "hover:bg-gray-300 rounded cursor-pointer p-1 my-2 inline-block"
							: "pointer-events-none ic-opacity-50 p-1 my-2 inline-block"
					}
					title="Open link in new tab"
				>
					<span className="ic ic-black ic-open-in-new"></span>
				</a>
				<input
					className="ml-2 my-2 mr-2 px-2 py-1 rounded bg-opacity-50 focus:outline-none active:outline-none focus-visible:outline-none bg-gray-300 focus-visible:bg-opacity-80 text-sm font-medium"
					type="text"
					value={linkURL}
					placeholder="insert a link here"
					onChange={onLinkURLChange}
				/>
				<button
					className="hover:bg-blue-300 disabled:bg-opacity-0 disabled:cursor-not-allowed rounded cursor-pointer px-1 py-1 text-xs mb-1"
					disabled={String(linkURL).length < 3}
					onClick={onApply}
				>
					<span className="ic ic-md ic-black ic-done"></span>
				</button>
				{/* <button
          className="hover:bg-red-200 bg-red-100 my-2 rounded cursor-pointer p-1 ml-2 text-xs"
          onClick={() => {}}
        >
          <span className="ic ic-black ic-delete"></span>
        </button> */}
			</div>
		</div>
	);
}
