import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import { PopOverProps } from '../constants/Interfaces';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import Highlight from '@mui/icons-material/Highlight';

const PopOver: React.FC<PopOverProps> = ({ editor , ref }) => {
  if (!editor) return null;
  
  // Ensure that PopOverMenu is only visible when text is selected
  const shouldShow: BubbleMenuProps['shouldShow']= ({ editor, from, to }) => {
    return from !== to && !editor.isActive('code');
  }

  // Prevent child component operations from affecting parent components
  const handleDefaultAndPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleBold = (e: React.MouseEvent) => {
    handleDefaultAndPropagation(e);
    editor.chain().focus().toggleBold().run(); 
  }

  const handleItalic = (e: React.MouseEvent) => {
    handleDefaultAndPropagation(e);
    editor.chain().focus().toggleItalic().run(); 
  }

  const handleUnderline = (e: React.MouseEvent) => {
    handleDefaultAndPropagation(e);
    editor.chain().focus().toggleUnderline().run(); 
  }

  const handleHighlight = (e: React.MouseEvent) => {
    handleDefaultAndPropagation(e);
    editor.chain().focus().toggleHighlight().run();
  }

  return (
    <BubbleMenu  
      editor={editor} 
      tippyOptions={{duration: 100, zIndex: 100, placement: 'top', offset: [30, 5],}} 
      shouldShow={shouldShow} 
    >
      <div 
        onMouseDown={(e : React.MouseEvent) =>{
          handleDefaultAndPropagation(e);
        }}
        className={'bubble-menu pointer-events-none flex w-[24em] p-0 bg-gray-200 rounded-lg justify-around items-center divide-x divide-gray-500 shadow-lg shadow-gray-700/50'}
        ref={ref}
      >
        <button 
          onMouseDown={(e) => {
            handleDefaultAndPropagation(e);
          }}          
          onClick={handleBold} 
          className={`${editor.isActive('bold') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center rounded-l-lg`}
        >
          <FormatBold sx={{ fontSize: 16 }}/>
        </button>
        <button 
          onMouseDown={(e) => {
            handleDefaultAndPropagation(e);
          }}          
          onClick={handleItalic} 
          className={`${editor.isActive('italic') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center`}
        >
          <FormatItalic sx={{ fontSize: 16 }}/>
        </button>
        <button 
          onMouseDown={(e) => {
            handleDefaultAndPropagation(e);
          }}          
          onClick={handleUnderline} 
          className={`${editor.isActive('underline') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center`}
        >
          <FormatUnderlined sx={{ fontSize: 16 }}/>
        </button>
        <button 
          onMouseDown={(e) => {
            handleDefaultAndPropagation(e);
          }}          
          onClick={handleHighlight} 
          className={`${editor.isActive('highlight') ? 'bg-gray-400' : 'bg-transparent'} p-3 m-0 flex-1 pointer-events-auto flex justify-center items-center rounded-r-lg`}
        >
          <Highlight sx={{ fontSize: 16 }}/>
        </button>
      </div>
    </BubbleMenu>
  );
}

export default PopOver;