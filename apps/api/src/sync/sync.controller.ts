import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { SyncService } from './sync.service';
import { PushPayloadSchema, PullResponse, PushResponse } from 'core';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * POST /sync/push
   * Accepts a batch of local entries from the client.
   * Validates payload with Zod before passing to the service.
   */
  @Post('push')
  async push(@Body() body: unknown): Promise<PushResponse> {
    const parsed = PushPayloadSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Invalid push payload',
        errors: parsed.error.flatten(),
      });
    }

    return this.syncService.push(parsed.data);
  }

  /**
   * GET /sync/pull?since=<unix_ms>
   * Returns all entries updated after `since`.
   * If `since` is omitted, returns the full dataset (initial sync).
   */
  @Get('pull')
  async pull(@Query('since') since?: string): Promise<PullResponse> {
    const sinceMs = since ? parseInt(since, 10) : undefined;

    if (since !== undefined && (isNaN(sinceMs!) || sinceMs! < 0)) {
      throw new BadRequestException('since must be a non-negative unix timestamp in ms');
    }

    return this.syncService.pull(sinceMs);
  }
}
