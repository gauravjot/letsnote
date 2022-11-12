import {
  getActiveStyles,
  getTextBlockStyle,
  hasActiveLinkAtSelection,
  toggleBlockType,
  toggleLinkAtSelection,
  toggleStyle,
} from "../../utils/EditorUtils";

import React, { useCallback } from "react";
import { useSlateStatic } from "slate-react";
import useImageUploadHandler from "../../hooks/useImageUploadHandler";
import { dateTimePretty } from "../../utils/TimeSince";

const PARAGRAPH_STYLES = [
  "paragraph",
  "h1",
  "h2",
  "h3",
  "h4",
  "codeblock",
  "quote",
];
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

export default function Toolbar({ selection, previousSelection, note }) {
  const editor = useSlateStatic();

  const onBlockTypeChange = useCallback(
    (targetType) => {
      if (targetType === "multiple") {
        return;
      }
      toggleBlockType(editor, targetType);
    },
    [editor]
  );

  const onImageSelected = useImageUploadHandler(editor, previousSelection);

  const blockType = getTextBlockStyle(editor);

  return (
    <div className="top-0 z-30 sticky" id="toolbar">
      <div className="bg-gray-50 px-1 mt-1 shadow-md rounded ab-toolbar">
        <div className="px-3 pt-2 mb-1">
          <span className="text-lg font-serif">
            {note ? note.title : "Untitled"}
          </span>{" "}
          <span className="text-xs text-gray-500 align-middle">
            (created {note ? dateTimePretty(note.created) : "not yet"})
          </span>
        </div>
        {/* Dropdown for paragraph styles */}
        <ElementSelect
          title={getLabelForBlockStyle(blockType ?? "paragraph")}
          elements={PARAGRAPH_STYLES}
          onSelect={onBlockTypeChange}
        />
        {/* Buttons for character styles */}
        <div className="inline-block my-2.5">
          <div className="border-r-2 border-gray-300 inline-block pr-3">
            {CHARACTER_STYLES.map((style) => (
              <ToolBarButton
                key={style}
                characterstyle={style}
                label={style}
                isActive={getActiveStyles(editor).has(style)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  toggleStyle(editor, style);
                }}
              />
            ))}
          </div>
          {/* Link Button */}
          <ToolBarButton
            isActive={hasActiveLinkAtSelection(editor)}
            label={"link"}
            onMouseDown={() => toggleLinkAtSelection(editor)}
          />
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
      </div>
    </div>
  );
}

// Text Formatting

function ToolBarButton(props) {
  const { label, isActive, ...otherProps } = props;
  return (
    <button
      variant=""
      className={
        (isActive ? "font-bold bg-slate-300 " : "hover:bg-gray-300") +
        " ml-3 p-1 text-xs rounded aspect-square"
      }
      active={isActive ? "true" : "false"}
      {...otherProps}
    >
      <span
        className={"ic ic-md ic-black align-middle " + getIconForButton(label)}
      ></span>
    </button>
  );
}

function getIconForButton(style) {
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
      console.log(style.props.children);
      return "ic";
  }
}

// Element Select

function getLabelForBlockStyle(style) {
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
    default:
      throw new Error(`Unhandled style in getLabelForBlockStyle: ${style}`);
  }
}

function Element({ element, title, onSelect }) {
  return (
    <button
      variant=""
      className={
        (title === getLabelForBlockStyle(element)
          ? "font-bold bg-slate-300 "
          : "hover:bg-gray-300") + " ml-3 p-1 text-xs rounded aspect-square"
      }
      onClick={() => {
        onSelect(element);
      }}
    >
      <span className={"ic ic-md ic-black align-middle ic-" + element}></span>
    </button>
  );
}

function ElementSelect(props) {
  const { elements, title, onSelect } = props;

  return (
    <div className="border-r-2 border-gray-300 pr-3 inline-block my-2.5">
      {elements.map((element, index) => (
        <span key={index}>
          <Element element={element} title={title} onSelect={onSelect} />
        </span>
      ))}
    </div>
  );
}
