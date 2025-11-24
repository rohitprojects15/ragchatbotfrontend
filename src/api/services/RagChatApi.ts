/**
 * RAG Chat API Service
 *
 * Provides methods to interact with the RAG chat backend.
 * Handles both mock and real API calls.
 */

import ragChatClient from '../RagChatClient';
import { RAG_ENDPOINTS, RAG_API_MODE } from '../config/ragEndpoints';
import {
  ChatMessage,
  SendMessageRequest,
  SendMessageResponse,
  ChatHistoryResponse,
  ResetSessionResponse,
  MessageRole,
} from '../../types/chat.types';

// Mock data generator for development
const generateMockResponse = (userMessage: string): string => {
  const responses = [
    `Based on recent news articles, here's what I found: "${userMessage}" is an interesting topic. Let me provide you with relevant information from our news corpus.\n\n**Key Points:**\n- This is a mock response for development\n- Real backend will provide RAG-powered answers\n- Streaming will show responses in real-time\n\nWould you like more details?`,
    `According to the latest news articles:\n\n1. **Breaking News**: This is related to ${userMessage}\n2. **Analysis**: Multiple sources indicate interesting developments\n3. **Context**: Historical perspective shows patterns\n\nThis is a simulated response. Real backend will retrieve actual news content.`,
    `Great question about "${userMessage}"!\n\nHere's what our news corpus reveals:\n\n- **Recent Developments**: Mock data for testing\n- **Expert Opinion**: Placeholder analysis\n- **Related Topics**: Connected news items\n\n*Note: This is a mock response. Production will use real RAG pipeline.*`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class RagChatApiService {
  /**
   * Send a message and get a response (non-streaming)
   * Used as fallback when WebSocket is not available
   */
  public async sendMessage(
    request: SendMessageRequest
  ): Promise<SendMessageResponse> {
    if (RAG_API_MODE === 'mock') {
      // Mock implementation
      await delay(1000 + Math.random() * 1000); // Simulate network delay

      return {
        messageId: `msg_${Date.now()}`,
        sessionId: request.sessionId,
        response: generateMockResponse(request.message),
        timestamp: new Date(),
        sources: [
          'Reuters - Tech News (2024)',
          'BBC - Business Report',
          'Associated Press - Breaking News',
        ],
      };
    }

    // Real backend call
    const backendResponse = await ragChatClient.post<any>(
      RAG_ENDPOINTS.chat.sendMessage,
      {
        query: request.message,
        sessionId: request.sessionId,
      }
    );

    // Transform backend response to match frontend format
    return {
      messageId: `msg_${Date.now()}`,
      sessionId: backendResponse.sessionId,
      response: backendResponse.response,
      timestamp: new Date(backendResponse.timestamp),
      sources: backendResponse.sources.map((s: any) =>
        `${s.title} (${s.source})`
      ),
    };
  }

  /**
   * Get chat history for a session
   */
  public async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    if (RAG_API_MODE === 'mock') {
      // Mock implementation - return empty history for new sessions
      await delay(300);

      return {
        sessionId,
        messages: [],
        totalMessages: 0,
      };
    }

    // Real backend call
    return ragChatClient.get<ChatHistoryResponse>(
      RAG_ENDPOINTS.chat.getHistory(sessionId)
    );
  }

  /**
   * Reset/clear a chat session
   */
  public async resetSession(sessionId: string): Promise<ResetSessionResponse> {
    if (RAG_API_MODE === 'mock') {
      // Mock implementation
      await delay(500);

      const newSessionId = `session_${Date.now()}`;

      return {
        success: true,
        newSessionId,
        message: 'Session reset successfully',
      };
    }

    // Real backend call
    return ragChatClient.delete<ResetSessionResponse>(
      RAG_ENDPOINTS.chat.resetSession(sessionId)
    );
  }

  /**
   * Create a new chat session
   */
  public async createSession(): Promise<{ sessionId: string }> {
    if (RAG_API_MODE === 'mock') {
      // Mock implementation
      await delay(200);

      return {
        sessionId: `session_${Date.now()}`,
      };
    }

    // Real backend call
    return ragChatClient.post<{ sessionId: string }>(
      RAG_ENDPOINTS.chat.createSession
    );
  }
}

// Export singleton instance
export const RagChatApi = new RagChatApiService();
