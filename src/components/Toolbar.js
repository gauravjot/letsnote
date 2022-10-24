import {
  getActiveStyles,
  getTextBlockStyle,
  hasActiveLinkAtSelection,
  toggleBlockType,
  toggleLinkAtSelection,
  toggleStyle,
} from "../utils/EditorUtils";

import React, { useCallback } from "react";
import { useSlateStatic } from "slate-react";
import useImageUploadHandler from "../hooks/useImageUploadHandler";

const PARAGRAPH_STYLES = ["h1", "h2", "h3", "h4", "paragraph", "multiple"];
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
    <div className="toolbar">
      {/* Dropdown for paragraph styles */}
      <DropDown
        title={getLabelForBlockStyle(blockType ?? "paragraph")}
        elements={PARAGRAPH_STYLES}
        onSelect={onBlockTypeChange}
      />
      {/* Buttons for character styles */}
      {CHARACTER_STYLES.map((style) => (
        <ToolBarButton
          key={style}
          characterStyle={style}
          label={<span>{style}</span>}
          isActive={getActiveStyles(editor).has(style)}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleStyle(editor, style);
          }}
        />
      ))}
      {/* Link Button */}
      <ToolBarButton
        isActive={hasActiveLinkAtSelection(editor)}
        label={<span>link</span>}
        onMouseDown={() => toggleLinkAtSelection(editor)}
      />
      {/* Image Upload Button */}
      <ToolBarButton
        isActive={false}
        as={"label"}
        htmlFor="image-upload"
        label={
          <>
            <span>image</span>
            <input
              type="file"
              id="image-upload"
              className="image-upload-input"
              accept="image/png, image/jpeg"
              onChange={onImageSelected}
            />
          </>
        }
      />
    </div>
  );
}

function ToolBarStyleButton({ as, style, icon }) {
  const editor = useSlateStatic();
  return (
    <ToolBarButton
      as={as}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleStyle(editor, style);
      }}
      isActive={getActiveStyles(editor).has(style)}
      label={icon}
    />
  );
}

function ToolBarButton(props) {
  const { label, isActive, ...otherProps } = props;
  return (
    <button
      variant="outline-primary"
      className={isActive ? "font-bold mx-2 bg-gray-400" : "mx-2"}
      active={isActive}
      {...otherProps}
    >
      {label}
    </button>
  );
}

function getIconForButton(style) {
  switch (style) {
    case "bold":
      return "bi-type-bold";
    case "italic":
      return "bi-type-italic";
    case "code":
      return "bi-code-slash";
    case "underline":
      return "bi-type-underline";
    case "image":
      return "bi-file-image";
    case "link":
      return "bi-link-45deg";
    default:
      throw new Error(`Unhandled style in getIconForButton: ${style}`);
  }
}

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
function DropDown(props) {
  const { elements, title, onSelect, ...otherProps } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {title}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div
        className={open ? "block z-10 top-0 w-full h-full" : "hidden"}
        onClick={() => {
          setOpen(!open);
        }}
      ></div>
      <div className={open ? "block" : "hidden"}>
        <div
          className="absolute left-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1">
            {elements.map((blockType, index) => (
              <a
                href="#a"
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-slate-200"
                role="menuitem"
                key={index}
                onClick={() => {
                  setOpen(false);
                  onSelect(blockType);
                }}
              >
                {getLabelForBlockStyle(blockType)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
