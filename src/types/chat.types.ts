/**
 * Chat Types and Interfaces for RAG Chatbot
 */

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export enum MessageStatus {
  Sending = 'sending',
  Sent = 'sent',
  Error = 'error',
  Streaming = 'streaming',
}

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  status?: MessageStatus;
  isStreaming?: boolean;
  error?: string;
}

export interface SessionInfo {
  sessionId: string;
  createdAt: Date;
  messageCount: number;
  lastMessageAt?: Date;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
  timestamp?: Date;
}

export interface SendMessageResponse {
  messageId: string;
  sessionId: string;
  response: string;
  timestamp: Date;
  sources?: string[];
}

export interface ChatHistoryResponse {
  sessionId: string;
  messages: ChatMessage[];
  totalMessages: number;
}

export interface ResetSessionResponse {
  success: boolean;
  newSessionId: string;
  message: string;
}

export interface WebSocketMessage {
  type: 'start' | 'chunk' | 'end' | 'error';
  messageId?: string;
  content?: string;
  error?: string;
  metadata?: {
    sources?: string[];
    processingTime?: number;
  };
}
