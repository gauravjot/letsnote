import { Editor, Transforms } from "slate";
import React, { useCallback, useState } from "react";
import { useSlateStatic, useFocused, useSelected } from "slate-react";

import isHotkey from "is-hotkey";

const Image = ({ attributes, children, element }) => {
  const [isEditingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(element.caption);
  const editor = useSlateStatic();

  const selected = useSelected();
  const focused = useFocused();

  const applyCaptionChange = useCallback(
    (captionInput) => {
      const imageNodeEntry = Editor.above(editor, {
        match: (n) => n.type === "image",
      });
      if (imageNodeEntry == null) {
        return;
      }

      if (captionInput != null) {
        setCaption(captionInput);
      }

      Transforms.setNodes(
        editor,
        { caption: captionInput },
        { at: imageNodeEntry[1] }
      );
    },
    [editor, setCaption]
  );

  const onCaptionChange = useCallback(
    (event) => {
      setCaption(event.target.value);
    },
    [setCaption]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (!isHotkey("enter", event)) {
        return;
      }
      event.preventDefault();

      applyCaptionChange(event.target.value);
      setEditingCaption(false);
    },
    [applyCaptionChange, setEditingCaption]
  );

  const onToggleCaptionEditMode = useCallback(
    (event) => {
      const wasEditing = isEditingCaption;
      setEditingCaption(!isEditingCaption);
      wasEditing && applyCaptionChange(caption);
    },
    [isEditingCaption, applyCaptionChange, caption]
  );

  return (
    <div contentEditable={false} {...attributes}>
      <div>
        {!element.isUploading && element.url != null ? (
          <img src={String(element.url)} alt={caption} className={"image"} />
        ) : (
          <div className={"image-upload-placeholder"}>
            <div animation="border" variant="dark" />
          </div>
        )}
        {isEditingCaption ? (
          <div
            autoFocus={true}
            className={"image-caption-input"}
            size="sm"
            type="text"
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
