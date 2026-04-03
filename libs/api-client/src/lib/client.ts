export class ApiClient {
  constructor(private baseUrl: string) {}

  async getEntries(since?: number) {
    return fetch(`${this.baseUrl}/entries?since=${since}`)
      .then(res => res.json())
  }
}