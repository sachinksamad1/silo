# 🚀 Running Silo

Follow these instructions to get the Silo project up and running locally for development.

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js**: >= 20.0.0
- **pnpm**: >= 10.0.0
- **Docker & Docker Compose**: To run the backend services (PostgreSQL, MinIO, Redis).

---

## 🛠️ Step 1: Initial Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment file and update any necessary values:
   ```bash
   cp .env.example .env
   ```
   *Note: For local development, the default values in `.env.example` are pre-configured to work with the Docker Compose setup.*

---

## 🐳 Step 2: Start Backend Services

Silo requires PostgreSQL (for the sync mediator) and MinIO (for binary attachments).

1. **Spin up the Docker stack**:
   ```bash
   pnpm docker:up
   ```
   This will start:
   - **PostgreSQL**: `localhost:5432`
   - **MinIO**: `localhost:9000` (API) & `localhost:9001` (Console)
   - **Redis**: `localhost:6379`

2. **Run Database Migrations**:
   Once the database is up, apply the initial schema:
   ```bash
   pnpm db:push
   ```
   *Tip: Use `pnpm db:studio` to open a GUI for inspecting your PostgreSQL data.*

---

## 💻 Step 3: Launch Applications

You can run individual applications or the entire stack using Nx.

### 🌐 Web App (Next.js)
```bash
npx nx serve web
```
Visit: [http://localhost:4200](http://localhost:4200)

### 🏗️ API (NestJS)
```bash
npx nx serve api
```
API Base: [http://localhost:3000/api](http://localhost:3000/api)

### 🖥️ Desktop (Electron)
```bash
npx nx serve desktop
```
*Note: Ensure the Web App is running first, as the Electron shell wraps the local Next.js instance.*

### 📱 Mobile (Expo)
```bash
cd apps/mobile
pnpm start
```

---

## 🧪 Step 4: Verification

To ensure everything is working correctly, you can run the project-wide linting and tests:

```bash
# Run all linters
npx nx run-many -t lint

# Run all unit tests
npx nx run-many -t test
```

---

## 🧹 Maintenance Commands

| Action | Command |
| :--- | :--- |
| **Stop Docker Services** | `pnpm docker:down` |
| **Rebuild Docker Images** | `pnpm docker:build` |
| **Generate New Migration** | `pnpm db:generate` |
| **Reset Local Storage** | `pnpm nx run storage:test` (uses a clean in-memory instance) |

---

## 🆘 Troubleshooting

- **Database Connection Issues**: Ensure the `DATABASE_URL` in your `.env` matches the credentials in `docker-compose.yml`.
- **Port Conflicts**: If port `3000`, `4200`, or `5432` is already in use, update the mapping in `docker-compose.yml` and your `.env` accordingly.
- **Next.js Standalone Build**: If building for production, ensure `output: 'standalone'` is set in `apps/web/next.config.js`.
