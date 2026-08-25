import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ImageNode } from "../components/imageNode"

function Placeholder() {
  return <div className="editor-placeholder">No content available</div>;
}

const ExampleTheme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  quote: 'editor-quote',
  list: {
    ul: 'editor-list-ul',
    ol: 'editor-list-ol',
    listitem: 'editor-listitem',
  },
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    code: 'editor-text-code',
  },
  code: 'editor-code',
};

const editorConfig = {
  namespace: 'BlogContentViewer',  // MUST have unique namespace
  theme: ExampleTheme,
  editable: false,  // read-only mode
  onError(error) {
    console.error(error);
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
  ],
};

function applyHeadingAnchors(editor, headings = []) {
  const root = editor.getRootElement();
  if (!root) return;
  const nodes = root.querySelectorAll(
    ".editor-heading-h1, .editor-heading-h2, .editor-heading-h3"
  );
  nodes.forEach((el, index) => {
    const heading = headings[index];
    if (!heading) return;
    el.id = heading.id;
    el.dataset.chapter = String(index + 1).padStart(2, "0");
  });
}

function LexicalContentViewer({ content, headings, onReady }) {
  const [editor] = useLexicalComposerContext();
  const headingKey = (headings || []).map((item) => item.id).join("|");

  React.useEffect(() => {
    if (!content) return;

    try {
      const parsedState =
        typeof content === "string"
          ? editor.parseEditorState(JSON.parse(content))
          : editor.parseEditorState(content);

      editor.setEditorState(parsedState);
      const id = requestAnimationFrame(() => {
        applyHeadingAnchors(editor, headings);
        onReady?.();
      });
      return () => cancelAnimationFrame(id);
    } catch (e) {
      console.error("Failed to parse content", e);
    }
  }, [content, editor, headingKey, headings, onReady]);

  return (
    <RichTextPlugin
      contentEditable={<ContentEditable className="editor-input" />}
      placeholder={<Placeholder />}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}

export default function BlogContentViewer({ content, headings, onReady }) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <LexicalContentViewer
        content={content}
        headings={headings}
        onReady={onReady}
      />
    </LexicalComposer>
  );
}
