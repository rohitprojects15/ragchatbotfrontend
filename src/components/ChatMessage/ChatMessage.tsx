/**
 * ChatMessage Component
 *
 * Displays a single chat message (user or assistant).
 * Supports markdown rendering for assistant messages.
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType, MessageRole } from '../../types/chat.types';
import './ChatMessage.scss';

interface ChatMessageProps {
  message: ChatMessageType;
  showAvatar?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, showAvatar = true }) => {
  const isUser = message.role === MessageRole.User;
  const isAssistant = message.role === MessageRole.Assistant;

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      {isAssistant && showAvatar && (
        <div className="message-avatar">
          <div className="avatar-icon">
            <svg
              width="24"
              height="24"
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
        </div>
      )}

      <div className="message-content-wrapper">
        <div className="message-bubble">
          {isAssistant ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for better styling
                p: ({ children, ...props }) => <p {...props}>{children}</p>,
                h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
                h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
                h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
                h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
                ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
                ol: ({ children, ...props }) => <ol {...props}>{children}</ol>,
                li: ({ children, ...props }) => <li {...props}>{children}</li>,
                code: ({ inline, children, ...props }: any) =>
                  inline ? (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="code-block" {...props}>
                      {children}
                    </code>
                  ),
                pre: ({ children, ...props }) => (
                  <pre className="pre-block" {...props}>
                    {children}
                  </pre>
                ),
                a: ({ children, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="message-text">{message.content}</div>
          )}
        </div>

        {message.error && (
          <div className="message-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{message.error}</span>
          </div>
        )}
      </div>

      {isUser && showAvatar && (
        <div className="message-avatar">
          <div className="avatar-icon user-avatar">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                fill="currentColor"
              />
              <path
                d="M10 12.5C5.58172 12.5 2 15.4101 2 19V20H18V19C18 15.4101 14.4183 12.5 10 12.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
