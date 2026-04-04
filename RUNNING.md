# 🚀 Running Silo

Follow these instructions to get the Silo project up and running.

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js**: >= 20.0.0
- **pnpm**: >= 10.0.0
- **Docker & Docker Compose**: Required for both development and production.

---

## 🛠️ Step 1: Initial Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *Note: For local development, the default values in `.env.example` are pre-configured to work with the Docker Compose setup.*

---

## 👨‍💻 Mode A: Local Development

Use this mode for active coding. You run the infrastructure (DB, Storage) in Docker, and the applications (API, Web) locally for fast refresh.

### 1. Start Background Services
```bash
pnpm docker:up
```
This starts the essential infrastructure:
- **PostgreSQL**: `localhost:5432`
- **MinIO**: `localhost:9000` (API) & `localhost:9001` (Console)
- **Redis**: `localhost:6379`

### 2. Run Database Migrations
```bash
pnpm db:push
```
*Tip: Use `pnpm db:studio` to inspect your PostgreSQL data.*

### 3. Launch Applications
Run individual apps using Nx:

| App | Command | URL |
| :--- | :--- | :--- |
| **Web (Next.js)** | `pnpm nx serve web` | [http://localhost:4200](http://localhost:4200) |
| **API (NestJS)** | `pnpm nx serve api` | [http://localhost:3000/api](http://localhost:3000/api) |
| **Desktop** | `pnpm nx serve desktop` | (Requires Web app running) |
| **Mobile** | `cd apps/mobile && pnpm start` | Expo Go / Simulator |

---

## 🚢 Mode B: Full Production (Dockerized)

Use this mode to test the entire stack as it would run in a production environment. Everything (including Web and API) runs inside Docker containers.

### 1. Build and Start Everything
```bash
pnpm docker:prod:up
```
This uses `docker-compose.prod.yml` to orchestrate all services.

### 2. Stop Production Stack
```bash
pnpm docker:prod:down
```

---

## 🧪 Verification & Testing

```bash
# Run all linters
npx nx run-many -t lint

# Run all unit tests
npx nx run-many -t test
```

---

## 🧹 Maintenance Commands

| Action | Development Command | Production Command |
| :--- | :--- | :--- |
| **Stop Services** | `pnpm docker:down` | `pnpm docker:prod:down` |
| **Rebuild Images** | `pnpm docker:build` | `pnpm docker:prod:build` |
| **Apply Schema** | `pnpm db:push` | N/A (Handled via container) |
| **DB GUI** | `pnpm db:studio` | - |

---

## 🆘 Troubleshooting

- **Database Connection**: Ensure `DATABASE_URL` in `.env` matches your Docker setup.
- **Port Conflicts**: If `3000`, `4200`, or `5432` are in use, check for running processes or update `.env`.
- **Standalone Build**: The production Dockerfile expects Next.js to be in `standalone` mode.

