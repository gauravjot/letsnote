import {
  getActiveStyles,
  getTextBlockStyle,
  getTextAlignStyle,
  hasActiveLinkAtSelection,
  toggleBlockType,
  toggleLinkAtSelection,
  toggleStyle,
} from "../../utils/EditorUtils";

import { useCallback } from "react";
import { useSlateStatic } from "slate-react";
import useImageUploadHandler from "../../hooks/useImageUploadHandler";
import { dateTimePretty } from "../../utils/TimeSince";

const PARAGRAPH_STYLES = ["h1", "h2", "h3", "h4", "codeblock", "quote"];
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
        <div className="px-3 pt-2 mb-1 ml-1">
          <span className="text-lg font-serif font-medium">
            {note ? note.title : "Untitled"}
          </span>
          <button
            className="line-height-0 h-fit ml-1 align-top p-1 py-1 cursor-pointer rounded-md hover:bg-gray-300"
            onClick={() => {}}
          >
            <span className={"ic ic-gray-50 align-middle ic-edit"}></span>
          </button>{" "}
          <span className="text-xs text-gray-500 align-middle">
            (created {note ? dateTimePretty(note.created) : "not yet"})
          </span>
        </div>
        {/* Dropdown for paragraph styles */}
        <div className="border-r-2 border-gray-300 pr-3 inline-block my-2.5">
          <ElementSelect
            title={getLabelForBlockStyle(blockType ?? "paragraph")}
            elements={PARAGRAPH_STYLES}
            onSelect={onBlockTypeChange}
          />
        </div>

        {/* Buttons for character styles */}
        <div className="inline-block my-2.5">
          <div className="inline-block">
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
        <div className="pr-3 inline-block my-2.5">
          <ElementSelect
            title={getLabelForBlockStyle(
              getTextAlignStyle(editor) ?? "paragraph"
            )}
            elements={TEXT_ALIGN}
            onSelect={onBlockTypeChange}
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
        (isActive
          ? "bg-gray-300 hover:outline outline-1 outline-gray-400 "
          : "hover:bg-gray-300") + " infotrig ml-3 p-1 text-xs aspect-square"
      }
      active={isActive ? "true" : "false"}
      {...otherProps}
    >
      <span
        className={
          (isActive ? "ic-black " : "ic-gray-50 ") +
          "ic ic-md align-middle " +
          getIconForButton(label)
        }
      ></span>
      <div className="infomsg mt-3 z-30 whitespace-nowrap">
        {getTitleForTool(label)}
      </div>
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

function getTitleForTool(tool) {
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
    case "left":
      return "Align Left";
    case "right":
      return "Align Right";
    case "center":
      return "Align Center";
    case "justify":
      return "Justify Block";
    default:
      throw new Error(`Unhandled style in getLabelForBlockStyle: ${style}`);
  }
}

function Element({ element, title, onSelect }) {
  return (
    <button
      variant=""
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
          (title === getLabelForBlockStyle(element)
            ? "ic-black "
            : "ic-gray-50 ") +
          "ic ic-md align-middle ic-" +
          element
        }
      ></span>
      <div className="infomsg mt-3 z-30 whitespace-nowrap">
        {getTitleForTool(element)}
      </div>
    </button>
  );
}

function ElementSelect(props) {
  const { elements, title, onSelect } = props;
  return (
    <div className="inline-block">
      {elements.map((element, index) => (
        <span key={index}>
          <Element element={element} title={title} onSelect={onSelect} />
        </span>
      ))}
    </div>
  );
}
