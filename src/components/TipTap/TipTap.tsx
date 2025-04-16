// src/Tiptap.tsx
import { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TipTapProps } from '../../Interfaces';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight'; 
import PopOver from './PopOver';

const TipTap: React.FC<TipTapProps> = ({ content, placeholder, onUpdate}) => {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const bubbleMenuRef = useRef<HTMLDivElement>(null);
  
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
      }),
    ],
    content: content.trim() === "<p></p>" || content.trim() === "" ? "" : content,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: "h-[15em] min-h-[10em] p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 w-[90%] m-2"
      },
    }, 
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node) &&
        bubbleMenuRef.current &&
        !bubbleMenuRef.current.contains(event.target as Node)
      ) {
        if (isFocused && editor) {
          editor.commands.blur();

          window.getSelection()?.removeAllRanges();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [editor, isFocused]);
// *************************

  if (!editor) return null;

  return (
    <div ref={editorRef} >
      <PopOver editor={editor} ref={bubbleMenuRef} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default TipTap;