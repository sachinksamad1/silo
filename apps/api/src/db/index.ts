import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Connection pool — DATABASE_URL must be set in the environment.
// Format: postgresql://user:password@host:5432/dbname
const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
});

// Typed Drizzle client with full schema inference
export const db = drizzle(pool, { schema });

export type DrizzleDB = typeof db;
