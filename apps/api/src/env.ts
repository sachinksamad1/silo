import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

function unquote(value: string): string {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === '\'' && last === '\'')) {
      return value.slice(1, -1);
    }
  }

  return value;
}

function stripInlineComment(value: string): string {
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];

    if (char === '\'' && !inDouble) {
      inSingle = !inSingle;
    } else if (char === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (char === '#' && !inSingle && !inDouble) {
      return value.slice(0, i).trimEnd();
    }
  }

  return value.trimEnd();
}

function parseEnv(contents: string): Record<string, string> {
  const parsed: Record<string, string> = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    const rawValue = line.slice(equalsIndex + 1).trim();
    if (!key) {
      continue;
    }

    parsed[key] = unquote(stripInlineComment(rawValue));
  }

  return parsed;
}

function findWorkspaceEnvFile(startDir: string): string | null {
  let currentDir = startDir;

  while (true) {
    const candidate = join(currentDir, '.env');
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

export function loadApiEnv(): void {
  const envFile = findWorkspaceEnvFile(process.cwd());
  if (!envFile) {
    return;
  }

  const parsed = parseEnv(readFileSync(envFile, 'utf8'));

  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
