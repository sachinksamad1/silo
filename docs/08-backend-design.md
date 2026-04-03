# Backend Design

## Stack

- Framework: NestJS
- Database: PostgreSQL
- Storage: MinIO
- Cache: Redis (optional)

## Services

- Auth Service
- Entry Service
- Sync Service
- Media Service

## API Endpoints

POST   /auth/login
POST   /entries
GET    /entries
POST   /sync/push
GET    /sync/pull
POST   /media/upload

## Responsibilities

- Persist data
- Serve sync requests
- Manage authentication

## Non-Responsibilities

- Business logic (client handles it)
- Conflict resolution (client-first)