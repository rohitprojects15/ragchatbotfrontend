/**
 * ChatPage Component
 *
 * Main chat interface page that brings all components together.
 */

import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import ChatInput from '../../components/ChatInput/ChatInput';
import TypingIndicator from '../../components/TypingIndicator/TypingIndicator';
import './ChatPage.scss';

const ChatPage: React.FC = () => {
  const { messages, sessionId, isLoading, isStreaming, isResetting, sendMessage, resetSession, error } =
    useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  return (
    <div className="chat-page">
      <ChatHeader onResetSession={resetSession} isResetting={isResetting} />

      <div className="chat-container">
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2>Welcome to RAG News Chatbot!</h2>
              <p>Ask me anything about the latest news. I'll search through our news corpus and provide you with relevant, well-sourced answers.</p>
              <div className="example-questions">
                <h3>Try asking:</h3>
                <div className="example-chips">
                  <button className="example-chip" onClick={() => sendMessage('What are the latest technology trends?')}>
                    What are the latest technology trends?
                  </button>
                  <button className="example-chip" onClick={() => sendMessage('Tell me about recent business news')}>
                    Tell me about recent business news
                  </button>
                  <button className="example-chip" onClick={() => sendMessage('What happened in sports today?')}>
                    What happened in sports today?
                  </button>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && !isStreaming && <TypingIndicator />}

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <ChatInput
            onSend={sendMessage}
            disabled={isLoading || isStreaming || isResetting}
            isLoading={isLoading || isStreaming}
          />
        </div>
      </div>

      {/* {sessionId && (
        <div className="session-info">
          Session ID: {sessionId.substring(0, 20)}...
        </div>
      )} */}
    </div>
  );
};

export default ChatPage;
