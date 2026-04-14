# Docker Management Guidelines

This document provides a detailed guide on how to manage, build, and deploy the Silo project using Docker.

## Overview

The Silo project uses a containerized architecture to ensure consistency across development, staging, and production environments. We use **Docker Swarm** (via `docker stack`) for orchestration, which allows for easy management of multi-container services and overlay networking.

### Infrastructure Services
- **Database (db)**: PostgreSQL 16 (Alpine-based)
- **Object Storage (storage)**: MinIO (with automated bucket setup)
- **Cache (cache)**: Redis 7 (Alpine-based)

### Application Services
- **API (api)**: NestJS backend
- **Web (web)**: Next.js frontend (Standalone mode)

---

## Local Development

### 1. Infrastructure Only
If you want to run the infrastructure (DB, Storage, Redis) in Docker but run the API and Web apps locally for development:

```bash
pnpm docker:up
```
*Note: This uses `docker-compose.yml`.*

### 2. Full Stack
To run the entire stack (including API and Web) in Docker:

```bash
pnpm docker:prod:up
```
*Note: This uses `docker-compose.prod.yml` and builds the application Dockerfiles.*

### 3. Stopping Services

```bash
# Stop local infra
pnpm docker:down

# Stop full stack
pnpm docker:prod:down
```

---

## Building Images

The application Dockerfiles are multi-stage builds optimized for size and security.

### API Dockerfile (`apps/api/Dockerfile`)
- **Stage 1 (Builder)**: Installs dependencies and builds the NestJS app using `nx build`.
- **Stage 2 (Runner)**: Only includes the built assets and production dependencies.

### Web Dockerfile (`apps/web/Dockerfile`)
- **Stage 1 (Builder)**: Installs dependencies and builds the Next.js app.
- **Stage 2 (Runner)**: Uses Next.js **standalone** mode for a minimal footprint.

To manually build images:
```bash
docker build -t silo-api -f apps/api/Dockerfile .
docker build -t silo-web -f apps/web/Dockerfile .
```

---

## Configuration & Environment Variables

Docker services rely on environment variables defined in your `.env` file. Key variables include:

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | DB Username |
| `POSTGRES_PASSWORD` | DB Password |
| `STORAGE_KEY` | MinIO Access Key |
| `STORAGE_SECRET` | MinIO Secret Key |
| `DATABASE_URL` | Connection string for the API |
| `NEXT_PUBLIC_API_URL` | API endpoint for the Web app |

---

## Common Management Tasks

### Viewing Logs
Since we use Docker Stack, logs can be viewed per service:

```bash
# View API logs
docker service logs -f silo_api

# View DB logs
docker service logs -f silo_db
```

### Checking Service Status
```bash
docker stack ps silo
docker stack services silo
```

### Database Migrations
Migrations should be run from the host or via a one-off container that has access to the database network.

```bash
pnpm db:push
```

### Volume Persistence
The following volumes are used for data persistence:
- `postgres-data`: Database files.
- `minio-data`: Uploaded media and objects.
- `redis-data`: Cached data.

To wipe all data (Warning: IRREVERSIBLE):
```bash
docker volume rm $(docker volume ls -q | grep silo)
```

---

## Troubleshooting

- **Service failing to start**: Check logs using `docker service logs <service_name>`.
- **Network issues**: Ensure the `silo-network` (overlay driver) is correctly initialized. Swarm mode must be enabled (`docker swarm init`).
- **MinIO Bucket missing**: The `minio-setup` service runs once to ensure the bucket exists. If it fails, check its logs: `docker service logs silo_minio-setup`.

---

## Security Best Practices

1. **No Root**: Application processes should ideally run as non-root users (currently node-alpine defaults).
2. **Secrets Management**: For production, use `docker secret` instead of environment variables for sensitive data like `JWT_SECRET` and `POSTGRES_PASSWORD`.
3. **Resource Limits**: In `docker-compose.prod.yml`, consider adding `deploy.resources` to prevent a single container from consuming all host resources.
4. **Internal Network**: Only the `web` and `api` services should expose ports to the host. Infrastructure services (db, cache, storage) should only be accessible within the `silo-network`.
