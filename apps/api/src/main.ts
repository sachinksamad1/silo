/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initializeDatabase } from './db/migrate';
import { loadApiEnv } from './env';

async function bootstrap() {
  try {
    loadApiEnv();
    Logger.log('[Bootstrap] Initializing database...');
    try {
      await initializeDatabase();
      Logger.log('[Bootstrap] Database ready');
    } catch (dbError) {
      Logger.error('[Bootstrap] Failed to initialize database. Ensure your PostgreSQL container is running and DATABASE_URL is correct.', dbError);
      throw dbError;
    }

    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Allow all origins for local development
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    const port = process.env.PORT || 3000;
    Logger.log(`[Bootstrap] Attempting to listen on port: ${port}`);
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  } catch (error) {
    Logger.error('[Bootstrap] Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
