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
  },
  // Add more theme classes if needed
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

function LexicalContentViewer({ content }) {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    if (!content) return;

    try {
      const parsedState =
  typeof content === 'string'
    ? editor.parseEditorState(JSON.parse(content))
    : editor.parseEditorState(content);

      editor.setEditorState(parsedState);
    } catch (e) {
      console.error('Failed to parse content', e);
    }
  }, [content, editor]);

  return (
    <RichTextPlugin
      contentEditable={<ContentEditable className="editor-input" />}
      placeholder={<Placeholder />}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}

export default function BlogContentViewer({ content }) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <LexicalContentViewer  content={content} />
    </LexicalComposer>
  );
}
