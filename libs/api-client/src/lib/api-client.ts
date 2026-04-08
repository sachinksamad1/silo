import axios, { AxiosInstance } from 'axios';
import { Entry, EntrySchema, PullResponse } from 'core';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    const resolvedBaseURL = baseURL || process.env['NEXT_PUBLIC_API_URL'] || '/api';
    console.log(`[ApiClient] Initializing with baseURL: ${resolvedBaseURL}`);

    this.client = axios.create({
      baseURL: resolvedBaseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add logging for debugging
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const { config, response } = error;
        console.error(`[ApiClient Error] ${config?.method?.toUpperCase()} ${config?.baseURL}${config?.url}`, {
          status: response?.status,
          message: error.message,
          data: response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  // Auth (Placeholder)
  setToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Sync Endpoints
  async pushEntries(entries: Entry[]) {
    // Validate entries before pushing
    entries.forEach(e => EntrySchema.parse(e));
    return this.client.post('/sync/push', { entries });
  }

  async pullEntries(since?: number) {
    const response = await this.client.get<PullResponse>('/sync/pull', { params: { since } });
    // Validate responses
    if (response.data?.entries && Array.isArray(response.data.entries)) {
      response.data.entries.forEach(e => EntrySchema.parse(e));
    }
    return response;
  }
}

export const api = new ApiClient();
