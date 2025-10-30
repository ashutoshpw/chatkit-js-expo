import { createParser, type EventSourceMessage } from 'eventsource-parser';

/**
 * Stream handler for processing SSE (Server-Sent Events) responses
 */
export interface StreamHandler {
  onMessage: (data: any) => void;
  onError?: (error: Error) => void;
  onEnd?: () => void;
}

/**
 * Create a streaming request using fetch and eventsource-parser
 * This provides SSE support for React Native using a polyfill approach
 */
export async function createStream(
  url: string,
  options: RequestInit,
  handler: StreamHandler,
): Promise<() => void> {
  let aborted = false;
  const abortController = new AbortController();

  const fetchOptions: RequestInit = {
    ...options,
    signal: abortController.signal,
    headers: {
      ...options.headers,
      Accept: 'text/event-stream',
    },
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Create parser for SSE events
    const parser = createParser((event: EventSourceMessage) => {
      if (aborted) return;

      if (event.type === 'event') {
        try {
          const data = JSON.parse(event.data);
          handler.onMessage(data);
        } catch (error) {
          // If not JSON, pass raw data
          handler.onMessage(event.data);
        }
      }
    });

    // Read stream using ReadableStream API
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const processStream = async () => {
      try {
        while (!aborted) {
          const { done, value } = await reader.read();

          if (done) {
            handler.onEnd?.();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          parser.feed(chunk);
        }
      } catch (error) {
        if (!aborted) {
          handler.onError?.(
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      }
    };

    // Start processing
    processStream();
  } catch (error) {
    if (!aborted) {
      handler.onError?.(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  // Return abort function
  return () => {
    aborted = true;
    abortController.abort();
  };
}

/**
 * Process a single streaming message based on event type
 */
export function processStreamMessage(event: any): {
  type: 'start' | 'content' | 'end' | 'error' | 'tool' | 'unknown';
  data: any;
} {
  if (!event || typeof event !== 'object') {
    return { type: 'unknown', data: event };
  }

  // Determine message type based on structure
  if (event.type === 'response.start' || event.event === 'response.start') {
    return { type: 'start', data: event };
  }

  if (event.type === 'response.end' || event.event === 'response.end') {
    return { type: 'end', data: event };
  }

  if (event.type === 'error' || event.error) {
    return { type: 'error', data: event };
  }

  if (event.type === 'content.delta' || event.delta) {
    return { type: 'content', data: event.delta || event };
  }

  if (event.type === 'tool.call' || event.tool) {
    return { type: 'tool', data: event.tool || event };
  }

  return { type: 'unknown', data: event };
}
