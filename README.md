<!-- markdownlint-disable -->

# 📁 Silo

Silo is a **privacy-first, local-first, end-to-end encrypted** journaling platform. Designed to give users total data sovereignty, Silo ensures your memories stay on your devices and your hardware—never on a corporate server.

[![Nx](https://img.shields.io/badge/managed%20with-Nx-blue.svg)](https://nx.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange.svg)](https://pnpm.io/)
[![Phase](<https://img.shields.io/badge/status-Phase%201%20(MVP)-green.svg>)](docs/product/10-roadmap.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Why Silo?

In an era of cloud-dependency and data-mining, Silo stands for **Data Sovereignty**. Our philosophy is simple: **Your data, your devices, your control.**

-   🔒 **Privacy by Default**: Your journal entries are your own. No telemetry, no tracking, no corporate access.
-   🏠 **Self-Hosted Persistence**: You own the sync server. We provide the mediator; you provide the hardware.
-   📶 **Seamlessly Offline**: Journal from a mountain peak or a subway train. Silo works perfectly without an internet connection.

---

## ✨ Key Features

-   🔐 **End-to-End Encrypted**: Industry-standard AES-256-GCM encryption ensures that even the sync server only sees encrypted blobs (Phase 2).
-   📱 **Multi-Platform**: Native-feeling experiences across Web (Next.js), Mobile (Expo), and Desktop (Electron).
-   🔄 **Intelligent Sync**: A custom-built push/pull engine that handles conflict resolution and dirty-queue tracking smoothly.
-   📝 **Markdown-Rich Editor**: Built on TipTap, offering a distraction-free, rich-text experience that feels premium.
-   🎨 **Universal UI**: A beautiful, responsive interface powered by Tamagui that works consistently across touch and pointer devices.

---

## 🏗️ Technical Architecture

Silo is engineered as a highly modular **Nx Monorepo**. This allows us to share code-heavy logic (encryption, synchronization, storage schemas) across all platforms while maintaining native performance.

### Project Structure Breakdown

| Component | Responsibility | Primary Tech Stack |
| :--- | :--- | :--- |
| **`apps/web`** | PWA & Client Shell | Next.js 15, Tailwind, TipTap |
| **`apps/mobile`** | Native Mobile App | Expo, React Native, Tamagui |
| **`apps/desktop`** | Desktop Application | Electron, Next.js |
| **`apps/api`** | Sync Mediator | NestJS, Drizzle ORM, PostgreSQL |
| **`libs/core`** | Shared Business Logic | Zod Schemas, Domain Types |
| **`libs/sync`** | Consistency Engine | Push/Pull Dirty-Queue Management |
| **`libs/storage`** | Local Persistence | Dexie.js (Web), SQLite (Native) |
| **`libs/crypto`** | Security Layer | AES-256-GCM, Argon2id |

For deep dives into our technical decisions, see the [Documentation Index](docs/README.md).

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js**: >= 20.x
-   **pnpm**: >= 10.x
-   **Docker**: Required for local PostgreSQL and MinIO infrastructure.

### Quick Start (Development)

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Spin up infrastructure**:
    ```bash
    docker stack deploy -c docker-stack.yml silo-infra
    ```
4.  **Launch the development environment**:
    ```bash
    npx nx run-many -t dev --projects=web,api
    ```

> [!TIP]
> For detailed instructions on database migrations, media storage configuration, and platform-specific setup, refer to the [**Running Silo Guide**](RUNNING.md).

---

## 🛠️ Development Lifecycle

Standardized tasks managed via Nx:

| Task | Command |
| :--- | :--- |
| **Static Analysis** | `npx nx run-many -t lint` |
| **Unit Testing** | `npx nx run-many -t test` |
| **Production Build** | `npx nx run-many -t build` |
| **DB Schema Sync** | `npx nx run api:migrate:push` |

---

## 🗺️ Roadmap

-   [x] **Phase 1**: Local Storage & Basic Sync Engine (Current)
-   [ ] **Phase 2**: E2EE Integration & Key Derivation (Argon2id)
-   [ ] **Phase 3**: Rich Media Attachments (MinIO Integration)
-   [ ] **Phase 4**: Desktop & Mobile Beta Launch
-   [ ] **Phase 5**: CRDTs for robust multi-device conflict resolution

Check the complete [Roadmap](docs/product/10-roadmap.md) for more details.

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing bugs, improving documentation, or proposing new features.

1.  Read the [Architecture Principles](docs/architecture/02-architecture.md).
2.  Ensure you follow the [Coding Standards](AGENTS.md#coding-standards).
3.  If using AI assistance, follow our [AI Agent Guidelines](docs/agent/GUIDELINES.md).
4.  Open a PR with a descriptive title using [Conventional Commits](https://www.conventionalcommits.org/).

---

## 📄 License

Silo is licensed under the **MIT License**. See [LICENSE](LICENSE) for details. (c) 2026 Silo Team.
