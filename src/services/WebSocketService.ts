/**
 * WebSocket Service for Streaming Chat Responses
 *
 * Handles real-time streaming of RAG responses using WebSocket.
 * Supports both mock (simulated streaming) and real backend modes.
 */

import { RAG_API_MODE, getWebSocketUrl } from '../api/config/ragEndpoints';
import { IWebSocketMessage } from '../interfaces/IChat';

type MessageHandler = (message: IWebSocketMessage) => void;
type ErrorHandler = (error: Error) => void;
type CloseHandler = () => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private closeHandlers: Set<CloseHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isManualClose = false;

  /**
   * Connect to WebSocket server
   */
  public connect(sessionId: string): void {
    if (RAG_API_MODE === 'mock') {
      console.log('WebSocket: Mock mode - using simulated streaming');
      return;
    }

    try {
      const wsUrl = `${getWebSocketUrl()}?sessionId=${sessionId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: IWebSocketMessage = JSON.parse(event.data);
          this.notifyMessageHandlers(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        this.notifyErrorHandlers(new Error('WebSocket connection error'));
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.notifyCloseHandlers();

        // Attempt to reconnect if not manually closed
        if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.connect(sessionId), this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.notifyErrorHandlers(error as Error);
    }
  }

  /**
   * Send a message through WebSocket (for real backend)
   */
  public sendMessage(sessionId: string, message: string): void {
    if (RAG_API_MODE === 'mock') {
      // Mock streaming implementation
      this.simulateMockStreaming(sessionId, message);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'message',
          sessionId,
          content: message,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      console.error('WebSocket is not connected');
      this.notifyErrorHandlers(new Error('WebSocket is not connected'));
    }
  }

  /**
   * Simulate streaming for mock mode
   */
  private async simulateMockStreaming(sessionId: string, message: string): Promise<void> {
    const mockResponses = [
      `Based on recent news articles, here's what I found about "${message}":\n\n**Key Points:**\n- This is a simulated streaming response\n- Each word appears gradually like real streaming\n- Production will use actual RAG pipeline\n\n**Analysis:**\nThe news corpus contains relevant information that answers your query. In production, this will be powered by vector search and Google Gemini API.\n\n**Sources:**\n- Reuters Technology Report (2024)\n- BBC Business Analysis\n- Associated Press Breaking News`,

      `Great question! Let me search through the news articles...\n\n**Recent Developments:**\nAccording to multiple sources, there have been significant updates related to your query about "${message}".\n\n**Expert Insights:**\n1. Market analysis shows interesting trends\n2. Industry leaders have commented on this topic\n3. Historical context provides valuable perspective\n\n**Conclusion:**\nThis is a mock streaming response. Real implementation will retrieve actual news content and generate context-aware answers.\n\n*Sources: Reuters, BBC News, AP*`,
    ];

    const responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const messageId = `msg_${Date.now()}`;

    // Send start message
    this.notifyMessageHandlers({
      type: 'start',
      messageId,
    });

    // Simulate streaming by sending words one at a time
    const words = responseText.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 50));

      this.notifyMessageHandlers({
        type: 'chunk',
        messageId,
        content: words[i] + ' ',
      });
    }

    // Send end message
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.notifyMessageHandlers({
      type: 'end',
      messageId,
      metadata: {
        sources: [
          'Reuters - Technology Report (2024)',
          'BBC - Business Analysis',
          'Associated Press - Breaking News',
        ],
        processingTime: 2.5,
      },
    });
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Register a message handler
   */
  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    // Return unsubscribe function
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Register an error handler
   */
  public onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * Register a close handler
   */
  public onClose(handler: CloseHandler): () => void {
    this.closeHandlers.add(handler);
    return () => this.closeHandlers.delete(handler);
  }

  /**
   * Notify all message handlers
   */
  private notifyMessageHandlers(message: IWebSocketMessage): void {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  /**
   * Notify all error handlers
   */
  private notifyErrorHandlers(error: Error): void {
    this.errorHandlers.forEach((handler) => handler(error));
  }

  /**
   * Notify all close handlers
   */
  private notifyCloseHandlers(): void {
    this.closeHandlers.forEach((handler) => handler());
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
