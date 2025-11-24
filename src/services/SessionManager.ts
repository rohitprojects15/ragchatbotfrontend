/**
 * Session Manager
 *
 * Manages chat session IDs and persistence using localStorage.
 * Each user gets a unique session ID that persists across page refreshes.
 */

import { SessionInfo } from '../types/chat.types';

const SESSION_STORAGE_KEY = 'rag_chat_session';
const SESSION_INFO_KEY = 'rag_chat_session_info';

class SessionManagerService {
  /**
   * Get or create a session ID
   */
  public getOrCreateSession(): string {
    const existingSessionId = this.getSessionId();

    if (existingSessionId) {
      return existingSessionId;
    }

    return this.createNewSession();
  }

  /**
   * Get current session ID from localStorage
   */
  public getSessionId(): string | null {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error('Error reading session ID from localStorage:', error);
      return null;
    }
  }

  /**
   * Create a new session
   */
  public createNewSession(): string {
    const sessionId = this.generateSessionId();
    this.saveSessionId(sessionId);

    // Initialize session info
    const sessionInfo: SessionInfo = {
      sessionId,
      createdAt: new Date(),
      messageCount: 0,
    };
    this.saveSessionInfo(sessionInfo);

    return sessionId;
  }

  /**
   * Save session ID to localStorage
   */
  private saveSessionId(sessionId: string): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } catch (error) {
      console.error('Error saving session ID to localStorage:', error);
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    // Generate a UUID v4-like ID
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Clear current session
   */
  public clearSession(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(SESSION_INFO_KEY);
    } catch (error) {
      console.error('Error clearing session from localStorage:', error);
    }
  }

  /**
   * Get session info
   */
  public getSessionInfo(): SessionInfo | null {
    try {
      const infoStr = localStorage.getItem(SESSION_INFO_KEY);
      if (!infoStr) return null;

      const info = JSON.parse(infoStr);
      // Convert date strings back to Date objects
      return {
        ...info,
        createdAt: new Date(info.createdAt),
        lastMessageAt: info.lastMessageAt ? new Date(info.lastMessageAt) : undefined,
      };
    } catch (error) {
      console.error('Error reading session info from localStorage:', error);
      return null;
    }
  }

  /**
   * Save session info
   */
  public saveSessionInfo(info: SessionInfo): void {
    try {
      localStorage.setItem(SESSION_INFO_KEY, JSON.stringify(info));
    } catch (error) {
      console.error('Error saving session info to localStorage:', error);
    }
  }

  /**
   * Update message count
   */
  public incrementMessageCount(): void {
    const info = this.getSessionInfo();
    if (info) {
      info.messageCount++;
      info.lastMessageAt = new Date();
      this.saveSessionInfo(info);
    }
  }

  /**
   * Check if session exists
   */
  public hasSession(): boolean {
    return this.getSessionId() !== null;
  }
}

// Export singleton instance
export const SessionManager = new SessionManagerService();
