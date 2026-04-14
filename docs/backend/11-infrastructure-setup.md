# Infrastructure Setup & Configuration

This document outlines the setup and configuration for the Silo infrastructure components, specifically Redis and MinIO.

## Overview

- **MinIO**: High-performance object storage compatible with Amazon S3. Used for storing media attachments (images, audio).
- **Redis**: In-memory data structure store. Used as a cache and potentially for pub/sub in the sync engine (currently optional).

---

## MinIO (Object Storage)

### 1. Local Development Setup
MinIO is included in the `docker-compose.yml` file.

```bash
docker stack deploy --compose-file docker-compose.yml silo
```

- **API Endpoint**: `http://localhost:9000`
- **Console (UI)**: `http://localhost:9001`

### 2. Configuration
The following environment variables in `.env` control MinIO:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `STORAGE_KEY` | MinIO Root User / Access Key | `minio_access_key` |
| `STORAGE_SECRET` | MinIO Root Password / Secret Key | `minio_secret_key` |
| `STORAGE_ENDPOINT` | API Endpoint URL | `http://localhost:9000` |
| `STORAGE_BUCKET` | Default bucket for media | `silo-media` |

### 3. Manual Initial Setup
1. Access the console at `http://localhost:9001`.
2. Login with your `STORAGE_KEY` and `STORAGE_SECRET`.
3. Go to **Buckets** -> **Create Bucket**.
4. Name it `silo-media` (or whatever matches your `STORAGE_BUCKET`).
5. (Optional) Set the **Access Policy** to `public` if you want attachments to be directly accessible via public URLs, otherwise keep it `private` and use signed URLs.

---

## Redis (Cache)

### 1. Local Development Setup
Redis is included in the `docker-compose.yml` file.

```bash
docker stack deploy --compose-file docker-compose.yml silo
```

- **Host**: `localhost`
- **Port**: `6379`

### 2. Configuration
The following environment variable in `.env` controls the Redis connection:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `REDIS_URL` | Redis Connection String | `redis://localhost:6379` |

### 3. Usage in Silo
- **Caching**: Used for storing frequently accessed journal metadata or user sessions.
- **Sync Coordination**: (Planned) Used for locking and coordinating sync jobs between multiple API instances.
- **Optional**: The system is designed to work without Redis for basic functionality, but it is required for high availability and performance.

---

## Production Considerations

### MinIO Persistence
- Ensure the Docker volume `minio-data` is backed up regularly.
- For production, consider using a managed S3-compatible service (AWS S3, Google Cloud Storage, DigitalOcean Spaces) by updating the `STORAGE_ENDPOINT` and credentials.

### Redis Security
- In production, always set a strong password.
- Use `REDIS_URL=redis://:password@host:port`.
- Ensure Redis is not exposed to the public internet.

### Monitoring
- MinIO provides a Prometheus-compatible metrics endpoint at `/minio/v2/metrics/cluster`.
- Redis metrics can be exported using the `redis_exporter`.

## Troubleshooting

- **MinIO: "SignatureDoesNotMatch"**: Ensure your `STORAGE_KEY` and `STORAGE_SECRET` are correct and that the system time of your client and MinIO server are synchronized.
- **Redis: "Connection refused"**: Verify the Redis container is running (`docker ps`) and that you are using the correct port (default 6379).
