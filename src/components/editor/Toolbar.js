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

const PARAGRAPH_STYLES = ["paragraph", "h1", "h2", "h3", "h4"];
const CHARACTER_STYLES = ["bold", "italic", "underline", "code"];

export default function Toolbar({ selection, previousSelection }) {
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
      <div className="bg-slate-300 px-1 shadow-md mt-6 rounded ab-toolbar">
        {/* Dropdown for paragraph styles */}
        <ElementSelect
          title={getLabelForBlockStyle(blockType ?? "paragraph")}
          elements={PARAGRAPH_STYLES}
          onSelect={onBlockTypeChange}
        />
        {/* Buttons for character styles */}
        <div className="inline-block my-2.5">
          <div className="border-r-2 border-gray-400 inline-block pr-3">
            {CHARACTER_STYLES.map((style) => (
              <ToolBarButton
                key={style}
                characterStyle={style}
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
          {/* Image Upload Button */}
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
        (isActive ? "font-bold bg-slate-400 border-gray-400 " : "") +
        " ml-3 p-1 text-xs rounded aspect-square"
      }
      active={isActive}
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
          ? "font-bold bg-slate-400 border-gray-400 "
          : "") + " ml-3 p-1 text-xs rounded aspect-square"
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
    <div className="border-r-2 border-gray-400 pr-3 inline-block my-2.5">
      {elements.map((element, index) => (
        <>
          <Element element={element} title={title} onSelect={onSelect} />
        </>
      ))}
    </div>
  );
}
