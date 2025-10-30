import type { Attachment } from '../types';
import { createStream, processStreamMessage, type StreamHandler } from './streaming';

export interface ChatKitAPIConfig {
  getClientSecret: (current: string | null) => Promise<string>;
  url?: string;
  fetch?: typeof fetch;
}

export interface SendMessageParams {
  text: string;
  threadId?: string | null;
  attachments?: Attachment[];
  reply?: string;
  newThread?: boolean;
}

export interface UploadFileParams {
  uri: string;
  name: string;
  mimeType: string;
}

/**
 * ChatKit API client for React Native
 * Handles authentication, message sending, and streaming responses
 */
export class ChatKitAPIClient {
  private config: ChatKitAPIConfig;
  private clientSecret: string | null = null;
  private fetchFn: typeof fetch;

  constructor(config: ChatKitAPIConfig) {
    this.config = config;
    this.fetchFn = config.fetch || fetch;
  }

  /**
   * Get or refresh the client secret
   */
  async getClientSecret(): Promise<string> {
    if (!this.clientSecret) {
      this.clientSecret = await this.config.getClientSecret(null);
    }
    return this.clientSecret;
  }

  /**
   * Refresh the client secret
   */
  async refreshClientSecret(): Promise<string> {
    this.clientSecret = await this.config.getClientSecret(this.clientSecret);
    return this.clientSecret;
  }

  /**
   * Get base URL for API requests
   */
  private getBaseUrl(): string {
    return this.config.url || 'https://api.openai.com/v1/chatkit';
  }

  /**
   * Get authorization headers
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const secret = await this.getClientSecret();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    };
  }

  /**
   * Send a message and stream the response
   */
  async sendMessage(
    params: SendMessageParams,
    handler: StreamHandler,
  ): Promise<() => void> {
    const headers = await this.getHeaders();
    const url = `${this.getBaseUrl()}/messages`;

    const body = {
      message: {
        role: 'user',
        content: params.text,
        attachments: params.attachments || [],
      },
      thread_id: params.newThread ? null : params.threadId,
      reply_to: params.reply,
      stream: true,
    };

    return createStream(
      url,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      },
      {
        onMessage: (data) => {
          const processed = processStreamMessage(data);
          handler.onMessage(processed);
        },
        onError: handler.onError,
        onEnd: handler.onEnd,
      },
    );
  }

  /**
   * Load a thread by ID
   */
  async loadThread(threadId: string): Promise<any> {
    const headers = await this.getHeaders();
    const url = `${this.getBaseUrl()}/threads/${threadId}`;

    const response = await this.fetchFn(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load thread: ${errorText}`);
    }

    return response.json();
  }

  /**
   * List threads
   */
  async listThreads(params?: {
    limit?: number;
    before?: string;
    after?: string;
  }): Promise<any> {
    const headers = await this.getHeaders();
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.before) queryParams.set('before', params.before);
    if (params?.after) queryParams.set('after', params.after);

    const url = `${this.getBaseUrl()}/threads?${queryParams}`;

    const response = await this.fetchFn(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list threads: ${errorText}`);
    }

    return response.json();
  }

  /**
   * Delete a thread
   */
  async deleteThread(threadId: string): Promise<void> {
    const headers = await this.getHeaders();
    const url = `${this.getBaseUrl()}/threads/${threadId}`;

    const response = await this.fetchFn(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete thread: ${errorText}`);
    }
  }

  /**
   * Update thread metadata (e.g., rename)
   */
  async updateThread(
    threadId: string,
    updates: { title?: string; metadata?: Record<string, any> },
  ): Promise<any> {
    const headers = await this.getHeaders();
    const url = `${this.getBaseUrl()}/threads/${threadId}`;

    const response = await this.fetchFn(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update thread: ${errorText}`);
    }

    return response.json();
  }

  /**
   * Upload a file attachment
   */
  async uploadFile(params: UploadFileParams): Promise<Attachment> {
    const headers = await this.getHeaders();
    const url = `${this.getBaseUrl()}/files`;

    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', {
      uri: params.uri,
      name: params.name,
      type: params.mimeType,
    } as any);

    const response = await this.fetchFn(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload file: ${errorText}`);
    }

    const result = await response.json();

    // Return attachment format
    if (params.mimeType.startsWith('image/')) {
      return {
        type: 'image',
        id: result.id,
        name: params.name,
        mimeType: params.mimeType,
        preview: params.uri,
      };
    }

    return {
      type: 'file',
      id: result.id,
      name: params.name,
      mimeType: params.mimeType,
    };
  }

  /**
   * Send feedback for a message
   */
  async sendFeedback(messageId: string, feedback: 'positive' | 'negative'): Promise<void> {
    const headers = await this.getHeaders();
    const url = `${this.getBaseUrl()}/messages/${messageId}/feedback`;

    const response = await this.fetchFn(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ feedback }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send feedback: ${errorText}`);
    }
  }

  /**
   * Retry a failed message
   */
  async retryMessage(messageId: string, handler: StreamHandler): Promise<() => void> {
    const headers = await this.getHeaders();
    const url = `${this.getBaseUrl()}/messages/${messageId}/retry`;

    return createStream(
      url,
      {
        method: 'POST',
        headers,
      },
      {
        onMessage: (data) => {
          const processed = processStreamMessage(data);
          handler.onMessage(processed);
        },
        onError: handler.onError,
        onEnd: handler.onEnd,
      },
    );
  }
}
