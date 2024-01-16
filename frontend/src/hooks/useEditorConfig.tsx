import { DefaultElement, ReactEditor } from "slate-react";
import Image from "@/components/home/editor/Image";
import Link from "@/components/home/editor/Link";
import LinkEditor from "@/components/home/editor/LinkEditor";
import isHotkey from "is-hotkey";
import { toggleStyle, insertContent, toggleBlockType } from "@/utils/EditorUtils";
import { BaseEditor } from "slate";

export default function useEditorConfig(editor: BaseEditor & ReactEditor) {
	const { isVoid } = editor;
	editor.isVoid = (element: any) => {
		return ["image"].includes(element.type) || isVoid(element);
	};

	editor.isInline = (element: any) => ["link"].includes(element.type);

	return { renderElement, renderLeaf, KeyBindings };
}

function renderElement(props: any) {
	const { element, children, attributes } = props;
	const style = { textAlign: element.align };
	switch (element.type) {
		case "image":
			return <Image {...props} />;
		case "paragraph":
			return (
				<p className="editor-p" style={style} {...attributes}>
					{children}
				</p>
			);
		case "h1":
			return (
				<h1 className="editor-h1" style={style} {...attributes}>
					{children}
				</h1>
			);
		case "h2":
			return (
				<h2 className="editor-h2" style={style} {...attributes}>
					{children}
				</h2>
			);
		case "h3":
			return (
				<h3 className="editor-h3" style={style} {...attributes}>
					{children}
				</h3>
			);
		case "h4":
			return (
				<h4 className="editor-h4" style={style} {...attributes}>
					{children}
				</h4>
			);
		case "codeblock":
			return (
				<div
					className="editor-codeblock"
					style={style}
					{...attributes}
					spellCheck="false"
				>
					{children}
				</div>
			);
		case "quote":
			return (
				<div className="editor-quote" style={style} {...attributes}>
					{children}
				</div>
			);

		case "ul":
			return (
				<ul className="editor-ul" style={style} {...attributes}>
					{children}
				</ul>
			);

		case "ol":
			return (
				<ol className="editor-ol" style={style} {...attributes}>
					{children}
				</ol>
			);

		case "li":
			return (
				<li className="editor-li" style={style} {...attributes}>
					{children}
				</li>
			);

		case "link":
			return <Link {...props} url={element.url} />;
		case "link-editor":
			return <LinkEditor {...props} />;
		default:
			return <DefaultElement {...props} />;
	}
}

function renderLeaf(props: any) {
	return <StyledText {...props} />;
}

const KeyBindings = {
	onKeyDown: (editor: any, event: any) => {
		if (isHotkey("mod+b", event)) {
			event.preventDefault();
			toggleStyle(editor, "bold");
			return;
		}
		if (isHotkey("mod+i", event)) {
			event.preventDefault();
			toggleStyle(editor, "italic");
			return;
		}
		if (isHotkey("mod+h", event)) {
			event.preventDefault();
			toggleStyle(editor, "highlight");
			return;
		}
		if (isHotkey("mod+u", event)) {
			event.preventDefault();
			toggleStyle(editor, "underline");
			return;
		}
		if (isHotkey("mod+`", event)) {
			event.preventDefault();
			toggleStyle(editor, "code");
			return;
		}
		if (isHotkey("tab", event)) {
			event.preventDefault();
			insertContent(editor, "	");
			return;
		}
		if (isHotkey("mod+shift+`", event)) {
			event.preventDefault();
			toggleBlockType(editor, "codeblock");
			return;
		}
		if (isHotkey("mod+shift+1", event)) {
			event.preventDefault();
			toggleBlockType(editor, "h1");
			return;
		}
		if (isHotkey("mod+shift+2", event)) {
			event.preventDefault();
			toggleBlockType(editor, "h2");
			return;
		}
		if (isHotkey("mod+shift+3", event)) {
			event.preventDefault();
			toggleBlockType(editor, "h3");
			return;
		}
		if (isHotkey("mod+shift+4", event)) {
			event.preventDefault();
			toggleBlockType(editor, "h4");
			return;
		}
	},
};

function StyledText({ attributes, children, leaf }: any) {
	if (leaf.bold) {
		children = <strong {...attributes}>{children}</strong>;
	}

	if (leaf.code) {
		children = <code {...attributes}>{children}</code>;
	}

	if (leaf.italic) {
		children = <em {...attributes}>{children}</em>;
	}

	if (leaf.underline) {
		children = <u {...attributes}>{children}</u>;
	}

	if (leaf.strike) {
		children = <s {...attributes}>{children}</s>;
	}

	if (leaf.sub) {
		children = <sub {...attributes}>{children}</sub>;
	}

	if (leaf.sup) {
		children = <sup {...attributes}>{children}</sup>;
	}

	if (leaf.highlight) {
		children = (
			<span className="editor-highlight" {...attributes}>
				{children}
			</span>
		);
	}

	return <span {...attributes}>{children}</span>;
}
