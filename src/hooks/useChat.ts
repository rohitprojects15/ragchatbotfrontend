/**
 * useChat Hook
 *
 * Main chat logic hook that manages messages, session, and WebSocket streaming.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, MessageRole, MessageStatus } from '../types/chat.types';
import { SessionManager } from '../services/SessionManager';
import { webSocketService } from '../services/WebSocketService';
import { RagChatApi } from '../api/services/RagChatApi';

interface UseChatReturn {
  messages: ChatMessage[];
  sessionId: string;
  isLoading: boolean;
  isStreaming: boolean;
  isResetting: boolean;
  sendMessage: (content: string) => Promise<void>;
  resetSession: () => Promise<void>;
  error: string | null;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const streamingMessageRef = useRef<string>('');
  const currentMessageIdRef = useRef<string>('');

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        const existingSessionId = SessionManager.getOrCreateSession();
        setSessionId(existingSessionId);

        // Load chat history (if backend supports it)
        try {
          const history = await RagChatApi.getChatHistory(existingSessionId);
          if (history.messages && history.messages.length > 0) {
            setMessages(history.messages);
          }
        } catch (err) {
          console.log('No previous chat history or backend not available');
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('Failed to initialize chat session');
      }
    };

    initSession();
  }, []);

  // Set up WebSocket message handler
  useEffect(() => {
    const unsubscribe = webSocketService.onMessage((wsMessage) => {
      if (wsMessage.type === 'start') {
        // Start of streaming message
        currentMessageIdRef.current = wsMessage.messageId || '';
        streamingMessageRef.current = '';
        setIsStreaming(true);

        // Add empty assistant message that will be filled during streaming
        setMessages((prev) => [
          ...prev,
          {
            id: currentMessageIdRef.current,
            content: '',
            role: MessageRole.Assistant,
            timestamp: new Date(),
            status: MessageStatus.Streaming,
            isStreaming: true,
          },
        ]);
      } else if (wsMessage.type === 'chunk') {
        // Streaming chunk received
        streamingMessageRef.current += wsMessage.content || '';

        // Update the streaming message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentMessageIdRef.current
              ? { ...msg, content: streamingMessageRef.current }
              : msg
          )
        );
      } else if (wsMessage.type === 'end') {
        // End of streaming
        setIsStreaming(false);
        setIsLoading(false);

        // Mark message as sent
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentMessageIdRef.current
              ? { ...msg, status: MessageStatus.Sent, isStreaming: false }
              : msg
          )
        );

        // Increment message count
        SessionManager.incrementMessageCount();

        // Reset refs
        streamingMessageRef.current = '';
        currentMessageIdRef.current = '';
      } else if (wsMessage.type === 'error') {
        // Error during streaming
        setIsStreaming(false);
        setIsLoading(false);
        setError(wsMessage.error || 'An error occurred');

        // Update message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentMessageIdRef.current
              ? {
                  ...msg,
                  status: MessageStatus.Error,
                  isStreaming: false,
                  error: wsMessage.error,
                }
              : msg
          )
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || isStreaming) return;

      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: content.trim(),
        role: MessageRole.User,
        timestamp: new Date(),
        status: MessageStatus.Sent,
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Send message via WebSocket for streaming
        webSocketService.sendMessage(sessionId, content.trim());

        // Increment message count
        SessionManager.incrementMessageCount();
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message');
        setIsLoading(false);

        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: `error_${Date.now()}`,
            content: 'Sorry, I encountered an error. Please try again.',
            role: MessageRole.Assistant,
            timestamp: new Date(),
            status: MessageStatus.Error,
            error: 'Failed to send message',
          },
        ]);
      }
    },
    [sessionId, isLoading, isStreaming]
  );

  // Reset session
  const resetSession = useCallback(async () => {
    setIsResetting(true);
    setError(null);

    try {
      // Clear local session
      SessionManager.clearSession();

      // Create new session
      const newSessionId = SessionManager.createNewSession();
      setSessionId(newSessionId);

      // Clear messages
      setMessages([]);

      // Reset states
      setIsLoading(false);
      setIsStreaming(false);

      console.log('Session reset successfully');
    } catch (err) {
      console.error('Error resetting session:', err);
      setError('Failed to reset session');
    } finally {
      setIsResetting(false);
    }
  }, []);

  return {
    messages,
    sessionId,
    isLoading,
    isStreaming,
    isResetting,
    sendMessage,
    resetSession,
    error,
  };
};
