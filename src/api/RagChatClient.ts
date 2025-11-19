/**
 * RAG Chat API Client
 *
 * Handles HTTP requests to the RAG backend API.
 * Supports both mock and real backend modes.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { RAG_API_MODE, getBaseUrl } from './config/ragEndpoints';

// Timeout constants
const NORMAL_TIMEOUT = 60000; // 1 minute
const LONG_TIMEOUT = 120000; // 2 minutes for RAG processing

class RagChatClient {
  private static instance: RagChatClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    const baseURL = getBaseUrl();

    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: NORMAL_TIMEOUT,
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add any custom headers or auth tokens here if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API request error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): RagChatClient {
    if (!RagChatClient.instance) {
      RagChatClient.instance = new RagChatClient();
    }
    return RagChatClient.instance;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    method: string,
    data?: any,
    params?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        url: endpoint,
        method: method,
        ...options,
      };

      if (data !== undefined && method !== 'GET') {
        config.data = data;
      }

      if (params) {
        config.params = params;
      }

      const response: AxiosResponse<T> = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  public async get<T>(
    endpoint: string,
    params?: any,
    options?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, params, options);
  }

  /**
   * POST request
   */
  public async post<T>(
    endpoint: string,
    data?: any,
    options?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>(endpoint, 'POST', data, undefined, {
      ...options,
      timeout: LONG_TIMEOUT, // Use longer timeout for RAG processing
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(
    endpoint: string,
    options?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, undefined, options);
  }

  /**
   * Access to the raw axios instance for advanced use cases
   */
  public getAxios(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export a singleton instance
const ragChatClient = RagChatClient.getInstance();
export default ragChatClient;
