import type { Config } from 'drizzle-kit';

export default {
  schema: './apps/api/src/db/schema.ts',
  out: './apps/api/src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/silo',
  },
} satisfies Config;
