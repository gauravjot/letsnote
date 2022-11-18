import { DefaultElement } from "slate-react";
import Image from "../components/editor/Image";
import Link from "../components/editor/Link";
import LinkEditor from "../components/editor/LinkEditor";
import React from "react";
import StyledText from "../components/editor/StyledText";
import isHotkey from "is-hotkey";
import { toggleStyle, insertContent } from "../utils/EditorUtils";

export default function useEditorConfig(editor) {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return ["image"].includes(element.type) || isVoid(element);
  };

  editor.isInline = (element) => ["link"].includes(element.type);

  return { renderElement, renderLeaf, KeyBindings };
}

function renderElement(props) {
  const { element, children, attributes } = props;
  switch (element.type) {
    case "image":
      return <Image {...props} />;
    case "paragraph":
      return (
        <p
          className="editor-p"
          {...attributes}
          contentEditable={"true"}
          suppressContentEditableWarning={true}
        >
          {children}
        </p>
      );
    case "h1":
      return (
        <h1
          className="editor-h1"
          {...attributes}
          contentEditable={"true"}
          suppressContentEditableWarning={true}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className="editor-h2"
          {...attributes}
          contentEditable={"true"}
          suppressContentEditableWarning={true}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          className="editor-h3"
          {...attributes}
          contentEditable={"true"}
          suppressContentEditableWarning={true}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4
          className="editor-h4"
          {...attributes}
          contentEditable={"true"}
          suppressContentEditableWarning={true}
        >
          {children}
        </h4>
      );
    case "codeblock":
      return (
        <div
          className="editor-codeblock"
          {...attributes}
          contentEditable={"true"}
          spellCheck="false"
          suppressContentEditableWarning={true}
        >
          {children}
        </div>
      );
    case "quote":
      return (
        <div
          className="editor-quote"
          {...attributes}
          contentEditable={"true"}
          suppressContentEditableWarning={true}
        >
          {children}
        </div>
      );
    case "link":
      return <Link {...props} url={element.url} />;
    case "link-editor":
      return <LinkEditor {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}

function renderLeaf(props) {
  return <StyledText {...props} />;
}

const KeyBindings = {
  onKeyDown: (editor, event) => {
    if (isHotkey("mod+b", event)) {
      toggleStyle(editor, "bold");
      return;
    }
    if (isHotkey("mod+i", event)) {
      toggleStyle(editor, "italic");
      return;
    }
    if (isHotkey("mod+u", event)) {
      toggleStyle(editor, "underline");
      return;
    }
    if (isHotkey("tab", event)) {
      event.preventDefault();
      event.stopPropagation();
      insertContent(editor, "	");
      return;
    }
    if (isHotkey("mod+opt+`", event)) {
      console.log("paragraph");
      return;
    }
    if (isHotkey("mod+opt+1", event)) {
      console.log("h1");
      return;
    }
    if (isHotkey("mod+opt+2", event)) {
      console.log("h2");
      return;
    }
    if (isHotkey("mod+opt+3", event)) {
      console.log("h3");
      return;
    }
    if (isHotkey("mod+opt+4", event)) {
      console.log("h4");
      return;
    }
  },
};
