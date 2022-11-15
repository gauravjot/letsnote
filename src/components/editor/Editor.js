import { useCallback, useRef, useState } from "react";
import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";

import {
  identifyLinksInTextIfAny,
  isLinkNodeAtSelection,
} from "../../utils/EditorUtils";
import useEditorConfig from "../../hooks/useEditorConfig";
import useSelection from "../../hooks/useSelection";

import LinkEditor from "./LinkEditor";
import Toolbar from "./Toolbar";
import ExampleDocument from "../../utils/ExampleDocument";

export default function Editor({ document, onChange, note }) {
  const [editor] = useState(() => withReact(withHistory(createEditor())));
  const editorRef = useRef(null);
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
      <Toolbar
        selection={selection}
        previousSelection={previousSelection}
        note={note}
      />
      {document === ExampleDocument ? (
        <div className="z-10 top-1/2 mx-auto left-0 right-0 text-center font-thin text-2xl text-gray-300 user-select-none absolute">
          start typing and we'll auto save
        </div>
      ) : (
        ""
      )}
      <div className={"editor-container"}>
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
