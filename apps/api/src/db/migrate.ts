import { existsSync } from 'fs';
import { join } from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './index';

function findMigrationFolder(startDir: string): string {
  const candidateSegments = [
    'src/db/migrations',
    'apps/api/src/db/migrations',
    'db/migrations',
  ];

  let currentDir = startDir;

  while (true) {
    for (const segment of candidateSegments) {
      const candidate = join(currentDir, segment);
      if (existsSync(join(candidate, 'meta', '_journal.json'))) {
        return candidate;
      }
    }

    const parentDir = join(currentDir, '..');
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  throw new Error(
    'Unable to locate the API migration folder. Expected a db/migrations directory containing meta/_journal.json.',
  );
}

export async function initializeDatabase(): Promise<void> {
  const migrationsFolder = findMigrationFolder(process.cwd());
  await migrate(db, { migrationsFolder });
}
