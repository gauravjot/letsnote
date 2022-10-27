import { Editable, Slate, withReact } from "slate-react";
import {
  identifyLinksInTextIfAny,
  isLinkNodeAtSelection,
} from "../utils/EditorUtils";
import { useCallback, useMemo, useRef } from "react";

import LinkEditor from "./LinkEditor";
import React from "react";
import Toolbar from "./Toolbar";
import { createEditor } from "slate";
import useEditorConfig from "../hooks/useEditorConfig";
import useSelection from "../hooks/useSelection";

export default function Editor({ document, onChange }) {
  const editorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderLeaf, renderElement, KeyBindings } = useEditorConfig(editor);

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editor, event),
    [KeyBindings, editor]
  );

  const [previousSelection, selection, setSelection] = useSelection(editor);

  // we update selection here because Slate fires an onChange even on pure selection change.
  const onChangeLocal = useCallback(
    (doc) => {
      onChange(doc);
      setSelection(editor.selection);
      identifyLinksInTextIfAny(editor);
    },
    [onChange, setSelection, editor]
  );

  let selectionForLink = null;
  if (isLinkNodeAtSelection(editor, selection)) {
    selectionForLink = selection;
  } else if (
    selection == null &&
    isLinkNodeAtSelection(editor, previousSelection)
  ) {
    selectionForLink = previousSelection;
  }

  return (
    <Slate editor={editor} value={document} onChange={onChangeLocal}>
      <div className={"editor-container"}>
        <Toolbar selection={selection} previousSelection={previousSelection} />
        <div>
          <div>
            <div className="editor" ref={editorRef}>
              {selectionForLink != null ? (
                <LinkEditor
                  editorOffsets={
                    editorRef.current != null
                      ? {
                          x: editorRef.current.getBoundingClientRect().x,
                          y: editorRef.current.getBoundingClientRect().y,
                        }
                      : null
                  }
                  selectionForLink={selectionForLink}
                />
              ) : null}
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </Slate>
  );
}
