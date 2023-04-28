import React, { useState } from 'react';
import './PromptModal.css';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  titleContent: string;
  onSubmit: (inputValue: string, contentValue: string) => void;
  onClose: () => void;
  content: string;
  readOnly?: boolean;
}

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, title, titleContent, onSubmit, onClose, content, readOnly }) => {
  const [inputValue, setInputValue] = useState('');
  const [contentValue, setContentValue] = useState('');

  const handleSubmit = () => {
    onSubmit(inputValue, contentValue);
    setInputValue('');
    setContentValue('');
    onClose();
  };

  return (
    <div className={`prompt-modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="prompt-modal-content">
        <h4>{title}</h4>
        {readOnly ? (
          <div className="file-content">{content}</div>
        ) : (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="prompt-input"
            />
            {titleContent && (
              <>
                <h4>{titleContent}</h4>
                <input
                  type="text"
                  value={contentValue}
                  onChange={(e) => setContentValue(e.target.value)}
                  className="prompt-input"
                />
              </>
            )}
          </>
        )}
        <div className="prompt-modal-buttons">
          {!readOnly && (
            <button className="prompt-submit" onClick={handleSubmit}>
              Submit
            </button>
          )}
          <button className="prompt-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;