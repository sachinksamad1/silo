import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { loadApiEnv } from '../env';

// Connection pool — DATABASE_URL must be set in the environment.
// Format: postgresql://user:password@host:5432/dbname
loadApiEnv();

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Define it in the workspace .env or export it before starting the API.',
  );
}

const pool = new Pool({
  connectionString,
});

// Typed Drizzle client with full schema inference
export const db = drizzle(pool, { schema });

export type DrizzleDB = typeof db;
