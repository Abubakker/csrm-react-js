import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface EmojiUploadProps {
  activeEmoji: boolean;
  onClose: () => void;
  setInputValue: Dispatch<SetStateAction<string>>;
  quillRef: any;
}

const EmojiUpload = ({
  activeEmoji,
  onClose,
  setInputValue,
  quillRef,
}: EmojiUploadProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setInputValue((prev) => prev + emojiObject.emoji);

    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      quill.focus();

      const selection = quill.getSelection();

      const cursorPosition = selection ? selection.index : quill.getLength();

      quill.clipboard.dangerouslyPasteHTML(cursorPosition, emojiObject.emoji);

      quill.setSelection(cursorPosition + emojiObject.emoji.length);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (activeEmoji) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeEmoji, onClose]);

  return (
    activeEmoji && (
      <div
        tabIndex={-1}
        aria-modal={false}
        role="dialog"
        className="mb-5 ml-5 absolute inset-0 flex items-end justify-start bg-transparent ease-in-out z-10"
      >
        <div ref={modalRef} className="mb-[75px]">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      </div>
    )
  );
};

export default EmojiUpload;
