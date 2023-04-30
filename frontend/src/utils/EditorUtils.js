import { Editor, Element } from "slate";
import { Point, Range, Text, Transforms, Element as SlateElement } from "slate";

import isUrl from "is-url";

export function getActiveStyles(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}));
}

export function getTextBlockStyle(editor) {
  const selection = editor.selection;
  if (selection == null) {
    return null;
  }

  const topLevelBlockNodesInSelection = Editor.nodes(editor, {
    at: editor.selection,
    mode: "highest",
    match: (n) => Editor.isBlock(editor, n),
  });

  let blockType = null;
  let nodeEntry = topLevelBlockNodesInSelection.next();
  while (!nodeEntry.done) {
    const [node] = nodeEntry.value;
    if (blockType == null) {
      blockType = node.type;
    } else if (blockType !== node.type) {
      return "multiple";
    }

    nodeEntry = topLevelBlockNodesInSelection.next();
  }

  return blockType !== "image" ? blockType : null;
}

export function getTextAlignStyle(editor) {
  const selection = editor.selection;
  if (selection == null) {
    return null;
  }

  const topLevelBlockNodesInSelection = Editor.nodes(editor, {
    at: editor.selection,
    mode: "highest",
    match: (n) => Editor.isBlock(editor, n),
  });

  let blockType = null;
  let nodeEntry = topLevelBlockNodesInSelection.next();
  while (!nodeEntry.done) {
    const [node] = nodeEntry.value;
    if (blockType == null) {
      blockType = node.align;
    } else if (blockType !== node.align) {
      return "left";
    }

    nodeEntry = topLevelBlockNodesInSelection.next();
  }

  return blockType;
}

export function toggleStyle(editor, style) {
  const activeStyles = getActiveStyles(editor);
  if (activeStyles.has(style)) {
    Editor.removeMark(editor, style);
  } else {
    Editor.addMark(editor, style, true);
  }
}

export function insertContent(editor, content) {
  Editor.insertText(editor, content);
}

export function toggleBlockType(editor, blockType) {
  const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
  const LIST_TYPES = ["ol", "ul"];
  const currentBlockType = getTextBlockStyle(editor);
  const changeTo = currentBlockType === blockType ? "paragraph" : blockType;
  // if (TEXT_ALIGN_TYPES.includes(changeTo)) {
  //   Transforms.setNodes(
  //     editor,
  //     { type: currentBlockType, align: changeTo },
  //     { at: editor.selection, match: (n) => Editor.isBlock(editor, n) },
  //     { at: Editor.start(editor, [0]) }
  //   );
  // } else {
  //   Transforms.setNodes(
  //     editor,
  //     { type: changeTo },
  //     { at: editor.selection, match: (n) => Editor.isBlock(editor, n) },
  //     { at: Editor.start(editor, [0]) }
  //   );
  // }

  ////
  let format = changeTo;
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "li" : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

export function hasActiveLinkAtSelection(editor) {
  return isLinkNodeAtSelection(editor, editor.selection);
}

export function toggleLinkAtSelection(editor) {
  if (editor.selection == null) {
    return;
  }

  if (hasActiveLinkAtSelection(editor)) {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });
  } else {
    const isSelectionCollapsed =
      editor.selection == null || Range.isCollapsed(editor.selection);
    if (isSelectionCollapsed) {
      createLinkForRange(editor, null, "link", "", true /*isInsertion*/);
    } else {
      createLinkForRange(editor, editor.selection, "", "");
    }
  }
}

export function isLinkNodeAtSelection(editor, selection) {
  if (selection == null) {
    return false;
  }

  return (
    Editor.above(editor, {
      at: selection,
      match: (n) => n.type === "link",
    }) != null
  );
}

export function identifyLinksInTextIfAny(editor) {
  // if selection is not collapsed, we do not proceed with the link detection.
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
    return;
  }

  const [node] = Editor.parent(editor, editor.selection);
  // if we are already inside a link, exit early.
  if (node.type === "link") {
    return;
  }

  const [currentNode, currentNodePath] = Editor.node(editor, editor.selection);
  if (!Text.isText(currentNode)) {
    return;
  }

  let [start] = Range.edges(editor.selection);
  const cursorPoint = start;

  const startPointOfLastCharacter = Editor.before(editor, editor.selection, {
    unit: "character",
  });

  let lastCharacter = Editor.string(
    editor,
    Editor.range(editor, startPointOfLastCharacter, cursorPoint)
  );

  if (lastCharacter !== " ") {
    return;
  }

  let end = startPointOfLastCharacter;
  start = Editor.before(editor, end, {
    unit: "character",
  });

  const startOfTextNode = Editor.point(editor, currentNodePath, {
    edge: "start",
  });

  lastCharacter = Editor.string(editor, Editor.range(editor, start, end));

  while (lastCharacter !== " " && !Point.isBefore(start, startOfTextNode)) {
    end = start;
    start = Editor.before(editor, end, { unit: "character" });
    lastCharacter = Editor.string(editor, Editor.range(editor, start, end));
  }

  const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter);
  const lastWord = Editor.string(editor, lastWordRange);

  if (isUrl(lastWord)) {
    Promise.resolve().then(() =>
      createLinkForRange(editor, lastWordRange, lastWord, lastWord)
    );
  }
}

function createLinkForRange(editor, range, linkText, linkURL, isInsertion) {
  isInsertion
    ? Transforms.insertNodes(
        editor,
        {
          type: "link",
          url: linkURL,
          children: [{ text: linkText }],
        },
        range != null ? { at: range } : undefined
      )
    : Transforms.wrapNodes(
        editor,
        { type: "link", url: linkURL, children: [{ text: linkText }] },
        { split: true, at: range }
      );
}
