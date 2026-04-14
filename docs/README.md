# Silo Documentation Index

This index provides a structured overview of the Silo project documentation.

## AI Agent

| File                                         | Description                              |
| -------------------------------------------- | ---------------------------------------- |
| [agent/GUIDELINES.md](./agent/GUIDELINES.md) | Guidelines for developers using AI tools |

## Running & Infrastructure

| File                            | Description                          |
| ------------------------------- | ------------------------------------ |
| [Running Guide](../RUNNING.md)  | How to run apps locally or in Docker |

## Logs

| File                                                                                                 | Description                            |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [logs/2026-04-14-electron-skill-desktop-build.md](./logs/2026-04-14-electron-skill-desktop-build.md) | Electron skill & desktop build session |

## Product & Roadmap

| File                                             | Description              |
| ------------------------------------------------ | ------------------------ |
| [product/01-product.md](./product/01-product.md) | Vision, goals, MVP scope |
| [product/10-roadmap.md](./product/10-roadmap.md) | Phases and milestones    |

## Architecture

| File                                                                               | Description                  |
| ---------------------------------------------------------------------------------- | ---------------------------- |
| [architecture/02-architecture.md](./architecture/02-architecture.md)               | System design and tech stack |
| [architecture/03-client-architecture.md](./architecture/03-client-architecture.md) | Client platforms             |
| [architecture/04-data-model.md](./architecture/04-data-model.md)                   | Entities and schemas         |
| [architecture/05-offline-strategy.md](./architecture/05-offline-strategy.md)       | Offline-first principles     |

## Sync & Security

| File                                               | Description                       |
| -------------------------------------------------- | --------------------------------- |
| [sync/06-sync-engine.md](./sync/06-sync-engine.md) | Push/pull and conflict resolution |
| [sync/07-encryption.md](./sync/07-encryption.md)   | E2EE and key management           |

## Backend & Infrastructure

| File                                                                       | Description                     |
| -------------------------------------------------------------------------- | ------------------------------- |
| [backend/08-backend-design.md](./backend/08-backend-design.md)             | NestJS API design               |
| [backend/09-deployment.md](./backend/09-deployment.md)                     | Local and production deployment |
| [backend/11-infrastructure-setup.md](./backend/11-infrastructure-setup.md) | Redis and MinIO config          |
| [backend/12-docker-guidelines.md](./backend/12-docker-guidelines.md)       | Container best practices        |

## Analysis & Reports

| File                                                                       | Description                       |
| -------------------------------------------------------------------------- | --------------------------------- |
| [reports/review_analysis.md](./reports/review_analysis.md)                 | Detailed review of implementation |
| [reports/improvement_suggestions.md](./reports/improvement_suggestions.md) | Actionable steps for development  |
| [reports/migration_error_report.md](./reports/migration_error_report.md)   | Database migration issues         |

## Folder Structure

```
docs/
├── README.md                 # This file
├── agent/
│   └── GUIDELINES.md
├── logs/
│   └── 2026-04-14-electron-skill-desktop-build.md
├── misc/
│   └── agent_context_skill_improvement.md
├── product/
│   ├── 01-product.md
│   └── 10-roadmap.md
├── architecture/
│   ├── 02-architecture.md
│   ├── 03-client-architecture.md
│   ├── 04-data-model.md
│   └── 05-offline-strategy.md
├── sync/
│   ├── 06-sync-engine.md
│   └── 07-encryption.md
├── backend/
│   ├── 08-backend-design.md
│   ├── 09-deployment.md
│   ├── 11-infrastructure-setup.md
│   └── 12-docker-guidelines.md
└── reports/
    ├── review_analysis.md
    ├── improvement_suggestions.md
    └── migration_error_report.md
```
