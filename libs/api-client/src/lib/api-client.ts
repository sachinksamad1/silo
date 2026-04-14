import axios, { AxiosInstance } from 'axios';
import { Entry, EntrySchema, PullResponse } from 'core';

function safeStringify(obj: any): string {
  try {
    const cache = new Set();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.has(value)) return '[Circular]';
          cache.add(value);
        }
        return value;
      },
      2,
    );
  } catch (err) {
    return '[Unstringifiable]';
  }
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    // In dev, we prefer /api to hit the Next.js rewrite/proxy on port 4000.
    // This avoids CORS and host mismatch issues.
    const envBaseURL = process.env['NEXT_PUBLIC_API_URL'];
    const resolvedBaseURL = baseURL || (envBaseURL && envBaseURL.trim()) || '/api';

    console.log(`[ApiClient] Initializing with baseURL: ${resolvedBaseURL}`);

    this.client = axios.create({
      baseURL: resolvedBaseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        try {
          if (!error) {
            console.error('[ApiClient Error] Unknown error (null/undefined)');
            return Promise.reject(error);
          }

          const cfg = error.config || null;
          const resp = error.response || null;
          const isNetworkError = !resp;

          const errorInfo = {
            message: error.message || 'No message',
            code: error.code || 'N/A',
            method: cfg?.method?.toUpperCase() || 'UNKNOWN',
            url: (cfg?.baseURL || '') + (cfg?.url || '') || 'UNKNOWN',
            status: resp?.status || 'NO_RESPONSE',
            type: isNetworkError ? 'NETWORK_ERROR' : 'API_ERROR',
          };

          // Log concise error
          console.error(`[ApiClient Error] ${errorInfo.type}: ${errorInfo.message} [${errorInfo.method} ${errorInfo.url}]`, errorInfo);

          if (isNetworkError) {
            console.error('[ApiClient Error] Detailed Network/Connectivity Context:', {
              baseURL: cfg?.baseURL,
              relativeUrl: cfg?.url,
              headers: cfg?.headers,
              envBaseURL,
              isClientSide: typeof window !== 'undefined',
              currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'SSR',
            });
          }

          // Full debug log
          console.error('[ApiClient Error] originalError (stringified):', safeStringify(error));
        } catch (logErr) {
          console.error('CRITICAL: ApiClient interceptor failed during error handling!', logErr);
        }

        return Promise.reject(error);
      },
    );
  }

  // Auth (Placeholder)
  setToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Sync Endpoints
  async pushEntries(entries: Entry[]) {
    // Validate entries before pushing
    entries.forEach((e) => EntrySchema.parse(e));
    return this.client.post('/sync/push', { entries });
  }

  async pullEntries(since?: number) {
    const response = await this.client.get<PullResponse>('/sync/pull', {
      params: { since },
    });
    // Validate responses
    if (response.data?.entries && Array.isArray(response.data.entries)) {
      response.data.entries.forEach((e) => EntrySchema.parse(e));
    }
    return response;
  }
}

export const api = new ApiClient();
