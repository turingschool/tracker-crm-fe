import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import { PopOverProps } from '../../Interfaces';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import Highlight from '@mui/icons-material/Highlight';

const PopOver: React.FC<PopOverProps> = ({ editor }) => {
  if (!editor) return null;
  
  const shouldShow: BubbleMenuProps['shouldShow']= ({ editor, from, to }) => {
    return from !== to && editor.isEditable;
  }

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    
    editor.chain().focus().toggleBold().run(); 
  }

  const handleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    
    editor.chain().focus().toggleItalic().run(); 
  }

  const handleUnderline = (e: React.MouseEvent) => {
    e.preventDefault();
    
    editor.chain().focus().toggleUnderline().run(); 
  }

  const handleHighlight = (e: React.MouseEvent) => {
    e.preventDefault();
    
    editor.chain().focus().toggleHighlight().run();
  }

  return (
    <BubbleMenu  editor={editor} tippyOptions={{duration: 100, placement: 'top', offset: [30, 5],}} shouldShow={shouldShow} >
      <div onMouseDown={(e : React.MouseEvent) =>{
          e.preventDefault();
          e.stopPropagation();
        }}
        className={'pointer-events-none z-10000 flex w-[24em] p-0 bg-gray-200 rounded-lg justify-around items-center divide-x divide-gray-500'}
      >
        <button 
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}          
          onClick={handleBold} 
          className={`${editor.isActive('bold') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center rounded-l-lg`}
        >
          <FormatBold />
        </button>
        <button 
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}          
          onClick={handleItalic} 
          className={`${editor.isActive('italic') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center`}
        >
          <FormatItalic />
        </button>
        <button 
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}          
          onClick={handleUnderline} 
          className={`${editor.isActive('underline') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center`}
        >
          <FormatUnderlined />
        </button>
        <button 
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}          
          onClick={handleHighlight} 
          className={`${editor.isActive('highlight') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center rounded-r-lg`}
        >
          <Highlight />
        </button>
      </div>
    </BubbleMenu>
  );
}

export default PopOver;