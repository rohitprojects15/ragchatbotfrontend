/**
 * ChatHeader Component
 *
 * Header with app title and reset session button.
 */

import React from 'react';
import './ChatHeader.scss';

interface ChatHeaderProps {
  onResetSession: () => void;
  isResetting?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onResetSession, isResetting = false }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="header-title">
          <div className="app-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="title-text">
            <h1>RAG News Chatbot</h1>
            <p className="subtitle">Ask questions about the latest news</p>
          </div>
        </div>

        <button
          className={`reset-button ${isResetting ? 'resetting' : ''}`}
          onClick={onResetSession}
          disabled={isResetting}
          aria-label="Reset chat session"
        >
          {isResetting ? (
            <div className="spinner">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="12 38"
                />
              </svg>
            </div>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C7.70845 17 5.68428 15.7357 4.5 13.8889M3 10V6M3 10H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="button-text">Reset Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
