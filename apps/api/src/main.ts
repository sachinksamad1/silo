/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initializeDatabase } from './db/migrate';

function resolveCandidatePorts(): number[] {
  const rawCandidates = [
    process.env['API_PORT'],
    process.env.PORT,
    '3000',
    '3001',
  ];

  const ports = rawCandidates
    .map((value) => Number.parseInt(value ?? '', 10))
    .filter((value) => Number.isInteger(value) && value > 0);

  return [...new Set(ports)];
}

async function bootstrap() {
  Logger.log('[Bootstrap] Initializing database...');
  await initializeDatabase();
  Logger.log('[Bootstrap] Database ready');

  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow all origins for local development
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const candidatePorts = resolveCandidatePorts();
  let lastError: unknown;

  for (const port of candidatePorts) {
    try {
      Logger.log(`[Bootstrap] Attempting to listen on port: ${port}`);
      await app.listen(port, '0.0.0.0');
      Logger.log(`🚀 Application is running on: http://0.0.0.0:${port}/${globalPrefix}`);
      return;
    } catch (error) {
      lastError = error;
      const code = (error as { code?: string }).code;
      if (code !== 'EADDRINUSE') {
        throw error;
      }

      Logger.warn(`[Bootstrap] Port ${port} is already in use, trying the next candidate...`);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Unable to start API server on any candidate port.');
}

bootstrap();
