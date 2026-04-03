import axios, { AxiosInstance } from 'axios';
import { Entry, EntrySchema } from 'core';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL = process.env['NEXT_PUBLIC_API_URL'] || '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
    const response = await this.client.get<Entry[]>('/sync/pull', { params: { since } });
    // Validate responses
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach(e => EntrySchema.parse(e));
    }
    return response;
  }
}

export const api = new ApiClient();
