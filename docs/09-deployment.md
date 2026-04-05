# Deployment

## Local Development

Use Docker Compose:

- API
- PostgreSQL
- MinIO
- Redis

See [Infrastructure Setup](./11-infrastructure-setup.md) for detailed configuration.

## Example Services

- api
- db
- storage
- cache

## Production Options

### Simple
- VPS (Docker)

### Advanced
- Kubernetes

## Environment Variables

- DB_URL
- JWT_SECRET
- STORAGE_ENDPOINT
- STORAGE_KEY

## Backup Strategy

- Database dumps
- Object storage snapshots