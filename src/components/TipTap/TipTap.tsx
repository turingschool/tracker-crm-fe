// src/Tiptap.tsx
import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TipTapProps } from '../../Interfaces';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight'; 
import PopOver from './PopOver';

const TipTap: React.FC<TipTapProps> = ({ content, placeholder, onChange}) => {
  // Configure editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline, 
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: placeholder,
        includeChildren: true,
        showOnlyWhenEditable: true,
        emptyEditorClass: "is-empty"
      })
    ],
    content: content.trim() === "<p></p>" || content.trim() === "" ? "" : content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "h-[15em] min-h-[10em] p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 w-[90%] m-2"
      },
    },
  })

  // *************
  // Handle clicks on text selection -> collapse bubble menu and remove focus
  useEffect(() => {
    if (!editor) return;

    const editorEl = editor.view.dom;

    const handleSelectionClick = (e: MouseEvent) => {
      const { state } = editor;
      const { from, to } = state.selection;

      if (from !== to) {
        const start = editor.view.domAtPos(from).node;
        const end = editor.view.domAtPos(to).node;

        if (start.contains(e.target as Node) || end.contains(e.target as Node)) {
          // editor.commands.blur();
          editor.commands.setTextSelection({from: to, to });
        }
      }
    };

    editorEl.addEventListener('mousedown', handleSelectionClick);

    return () => {
      editorEl.removeEventListener('mousedown', handleSelectionClick);
    };
  }, [editor]);

  // Handle clicks inside of editor outside of bubble menu -> collapse bubble menu and remove focus
  useEffect(() => {
    if (!editor) return;

    const handleClickInsideEditor = (e: MouseEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const clickedInsideBubble = (e.target as HTMLElement).closest('.tiptap-bubble-menu');
      if (!clickedInsideBubble) {
        editor.commands.setTextSelection(editor.state.selection.to);
        editor.commands.blur();
      }
    };

    editor.view.dom.addEventListener('mousedown', handleClickInsideEditor);

    return () => {
      editor.view.dom.removeEventListener('mousedown', handleClickInsideEditor);
    };
  }, [editor])

  // Handle clicks ouside of the editor -> collapse bubble menu and remove focus
  useEffect(() => {
    if (!editor) return;

    const editorEl = editor.view.dom;

    const handleClickOutsideEditor = (e: MouseEvent) => {
      if (!editorEl.contains(e.target as Node)) {
        editor.commands.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideEditor);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideEditor);
    }
  }, [editor]);
// *************************

  if (!editor) return null;

  return (
    <>
      <PopOver editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}

export default TipTap;