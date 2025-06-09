import React, { useState } from 'react';
import { XIcon, SendIcon } from '../constants';

interface MessagePopupProps {
  receiverId: string;
  receiverName: string;
  onClose: () => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ receiverId, receiverName, onClose }) => {
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      alert('Please enter a message.');
      return;
    }
    alert(`Message sent to ${receiverName}: "${messageContent}" (Mock response)`);
    setMessageContent('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]" // Ensure z-index is high enough
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-popup-title"
    >
      <div 
        className="bg-dark-surface text-white rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="message-popup-title" className="text-lg font-semibold text-brand-orange">
            Message to {receiverName}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close message popup"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message here..."
          className="w-full bg-dark-surface-alt rounded-lg px-3 py-2.5 text-white outline-none h-32 resize-none focus:ring-2 focus:ring-brand-orange mb-4"
          aria-label="Message content"
        />
        
        <button
          onClick={handleSendMessage}
          className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-3 flex items-center justify-center gap-2 font-medium text-sm"
          disabled={!messageContent.trim()}
        >
          <SendIcon className="w-4 h-4" />
          <span>Send Message</span>
        </button>
      </div>
    </div>
  );
};

export default MessagePopup;
