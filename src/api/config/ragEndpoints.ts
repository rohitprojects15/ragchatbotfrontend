/**
 * RAG Chat API Endpoints Configuration
 *
 * This file contains all API endpoints for the RAG chatbot.
 * API_MODE determines whether to use mock or real backend.
 */

export const RAG_API_MODE = process.env.REACT_APP_RAG_MODE || 'mock'; // 'mock' or 'backend'

const BACKEND_BASE_URL = process.env.REACT_APP_RAG_BACKEND_URL || 'http://localhost:3001';
const MOCK_BASE_URL = process.env.REACT_APP_MOCK_API_URL || 'http://localhost:3000/mock';

// WebSocket URLs
export const WS_BACKEND_URL = process.env.REACT_APP_RAG_WS_URL || 'ws://localhost:3001/chat';
export const WS_MOCK_URL = 'mock'; // Will be handled by mock service

/**
 * Get the base URL based on current mode
 */
export const getBaseUrl = (): string => {
  return RAG_API_MODE === 'mock' ? MOCK_BASE_URL : BACKEND_BASE_URL;
};

/**
 * Get the WebSocket URL based on current mode
 */
export const getWebSocketUrl = (): string => {
  return RAG_API_MODE === 'mock' ? WS_MOCK_URL : WS_BACKEND_URL;
};

/**
 * RAG Chat API Endpoints
 */
export const RAG_ENDPOINTS = {
  // Chat endpoints
  chat: {
    sendMessage: '/api/chat/message',
    getHistory: (sessionId: string) => `/api/chat/history/${sessionId}`,
    resetSession: (sessionId: string) => `/api/chat/session/${sessionId}`,
    createSession: '/api/chat/session',
  },

  // WebSocket endpoint
  websocket: {
    chat: '/chat',
  },
};
