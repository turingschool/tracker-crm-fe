// src/Tiptap.tsx
// import { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TipTapProps } from '../../Interfaces';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight'; 
import PopOver from './PopOver';

const TipTap: React.FC<TipTapProps> = ({ content, onChange}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline, 
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: 'Notes ...',
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

  if (!editor) return null;
  
  return (
    <>
      <PopOver editor={editor}  onClose={() => {}}/>
      <EditorContent editor={editor} />
    </>
  );
}

export default TipTap;
