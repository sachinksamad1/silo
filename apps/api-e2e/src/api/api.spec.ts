import axios from 'axios';
import * as crypto from 'crypto';

describe('API Endpoints', () => {
  describe('GET /api', () => {
    it('should return a message', async () => {
      const res = await axios.get(`/api`);

      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'Hello API' });
    });
  });

  describe('Sync Flow', () => {
    const entryId = crypto.randomUUID();
    const now = Date.now();

    it('should push a new entry', async () => {
      const payload = {
        entries: [
          {
            id: entryId,
            content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'E2E Test Entry' }] }] },
            createdAt: now,
            updatedAt: now,
            tags: ['e2e'],
            mood: 5,
            attachments: [],
            dirty: true,
            deleted: false,
            version: 1,
          },
        ],
      };

      const res = await axios.post('/api/sync/push', payload);
      expect(res.status).toBe(201);
      expect(res.data.accepted).toContain(entryId);
    });

    it('should pull the pushed entry', async () => {
      const res = await axios.get('/api/sync/pull', { params: { since: now - 1000 } });
      expect(res.status).toBe(200);
      expect(res.data.entries.some((e: any) => e.id === entryId)).toBe(true);
      expect(res.data.serverTime).toBeDefined();
    });
  });
});
