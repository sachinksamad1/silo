# 📁 Silo

Silo is a **privacy-first, local-first, end-to-end encrypted** journaling platform. Designed to give users total data sovereignty, Silo ensures your memories stay on your devices and your hardware—never on a corporate server.

[![Nx](https://img.shields.io/badge/managed%20with-Nx-blue.svg)](https://nx.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange.svg)](https://pnpm.io/)
[![Phase](https://img.shields.io/badge/status-Phase%201%20(MVP)-green.svg)](docs/10-roadmap.md)

---

## ✨ Features

- 🔐 **End-to-End Encrypted**: AES-256-GCM encryption (libs/crypto).
- 🏠 **Self-Hosted**: Full control over the sync mediator (NestJS API).
- 📶 **Local-First**: Offline-ready with Dexie.js (Web) and SQLite (Mobile/Desktop).
- 📱 **Multi-Platform**: Seamless experience across Web, Mobile (Expo), and Desktop (Electron).
- 🔄 **Smart Sync**: Custom conflict resolution to keep all devices in harmony.

---

## 🏗️ Architecture

Silo is built as an **Nx monorepo** to share logic across platforms:

```text
apps/
  ├── web/          # Next.js 15 PWA
  ├── mobile/       # Expo / React Native
  ├── desktop/      # Electron
  └── api/          # NestJS Sync Mediator
libs/
  ├── core/         # Shared Zod schemas & logic
  ├── storage/      # Local DB (Dexie/SQLite) repository layer
  ├── sync/         # Push/Pull sync engine
  ├── crypto/       # E2EE (AES-GCM / Argon2id)
  ├── api-client/   # Typed Axios client
  └── ui/           # Shared Tamagui components
```

For deep dives, see the [Documentation Index](docs/README.md) (or `docs/01-product.md` to `docs/10-roadmap.md`).

---

## 🚀 Getting Started

For detailed instructions on setting up Docker, database migrations, and running each app, see the [**Running Silo Guide**](RUNNING.md).

### Prerequisites
- **Node.js**: >= 20.x
- **pnpm**: >= 10.x
- **Docker**: For running PostgreSQL & MinIO (backend).

### Setup
1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Run development server**:
   ```bash
   npx nx run-many -t dev --projects=web,api
   ```

---

## 🛠️ Development Commands

| Task | Command |
| :--- | :--- |
| **Start All** | `npx nx run-many -t dev` |
| **Build** | `npx nx run-many -t build` |
| **Lint** | `npx nx run-many -t lint` |
| **Test** | `npx nx run-many -t test` |

---

## 🗺️ Roadmap

- [x] **Phase 1**: Local storage & Basic Sync (Current)
- [ ] **Phase 2**: E2EE Integration
- [ ] **Phase 3**: Rich Media Support
- [ ] **Phase 4**: Desktop & Mobile Beta
- [ ] **Phase 5**: CRDTs & Public Beta

See [Roadmap Documentation](docs/10-roadmap.md) for details.

---

## 📄 License
MIT © 2026 Silo Team.
