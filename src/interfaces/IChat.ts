/**
 * Chat Types and Interfaces for RAG Chatbot
 */

export enum IMessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export enum IMessageStatus {
  Sending = 'sending',
  Sent = 'sent',
  Error = 'error',
  Streaming = 'streaming',
}

export interface IChatMessage {
  id: string;
  content: string;
  role: IMessageRole;
  timestamp: Date;
  status?: IMessageStatus;
  isStreaming?: boolean;
  error?: string;
}

export interface ISessionInfo {
  sessionId: string;
  createdAt: Date;
  messageCount: number;
  lastMessageAt?: Date;
}

export interface ISendMessageRequest {
  sessionId: string;
  message: string;
  timestamp?: Date;
}

export interface ISendMessageResponse {
  messageId: string;
  sessionId: string;
  response: string;
  timestamp: Date;
  sources?: string[];
}

export interface IChatHistoryResponse {
  sessionId: string;
  messages: IChatMessage[];
  totalMessages: number;
}

export interface IResetSessionResponse {
  success: boolean;
  newSessionId: string;
  message: string;
}

export interface IWebSocketMessage {
  type: 'start' | 'chunk' | 'end' | 'error';
  messageId?: string;
  content?: string;
  error?: string;
  metadata?: {
    sources?: string[];
    processingTime?: number;
  };
}
