# System Architecture

## Overview

Clients interact with a sync API which mediates persistence.
```
Clients (Web / Desktop / Mobile)
↓
Sync API (NestJS)
↓
Storage (Postgres + MinIO)
```

## Principles

- Offline-first
- Eventually consistent
- Local-first writes
- Server is sync mediator, not source of truth

## Layers

### 1. Client Layer
- UI + local database
- Sync queue

### 2. API Layer
- Handles authentication, sync, and data persistence

### 3. Storage Layer
- PostgreSQL → structured data
- MinIO → media storage

## Data Flow

1. User writes entry
2. Stored locally
3. Marked as dirty
4. Synced in background