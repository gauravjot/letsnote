import React from "react";

export default function StyledText({ attributes, children, leaf }) {
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
