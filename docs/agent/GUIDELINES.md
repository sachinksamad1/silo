# 🤖 AI Agent Guidelines for Developers

This document provides guidelines for developers interacting with AI agents within the Silo ecosystem. AI agents in this project are configured to be context-aware, following specific architectural and coding standards.

## 📌 Overview

The Silo project uses AI agents (like Antigravity) to accelerate development while maintaining strict adherence to our **Local-First** and **Privacy-First** principles. The agent's behavior is primarily governed by the `AGENTS.md` file in the root directory.

## 🛠 How Agents Operate

Agents in Silo use specialized **Skills** to perform tasks correctly within our Nx-managed monorepo.

### 1. Context Awareness
The agent reads `AGENTS.md` and the `docs/` directory to understand:
- **Monorepo Structure**: Shared logic in `libs/`, apps in `apps/`.
- **Tech Stack**: Next.js, NestJS, Electron, Expo, Tamagui, Dexie/SQLite.
- **Fundamental Rules**: Never read from API for rendering, always validate with Zod, etc.

### 2. Specialized Skills
Developers should expect the agent to use specific skills for different tasks:
- `nx-workspace`: Exploring project configuration.
- `nx-generate`: Scaffolding new components, apps, or libs.
- `storage`/`sync`: Interacting with the database and synchronization engine.
- `core`: Defining shared Zod schemas and types.

---

## 👩‍💻 Developer-Agent Interaction Guidelines

To get the most out of AI agents, follow these patterns:

### ✅ Do: Use Clear Task Scopes
- Provide specific, actionable requests (e.g., "Add a tagging system to the entry repository in `libs/storage`").
- Reference relevant documentation or files using `@` notation.

### ✅ Do: Enforce "Local-First" Logic
- Remind the agent that UI must never block on API responses.
- Ensure all mutations mark entries as `dirty: true` for the sync engine.

### ✅ Do: Verify Nx Commands
- The agent should always use `npx nx` instead of running tools (like `vitest` or `playwright`) directly.
- Verify that standard generators are used for new files to maintain consistency.

### ❌ Don't: Manual Path Manipulation
- Do not let the agent manually edit `tsconfig.base.json` paths or `package.json` dependencies unless using the `link-workspace-packages` skill.

---

## 🏗 Common Workflows with Agents

### Scaffolding new features
1. Ask the AI to `nx-generate` the necessary project or library.
2. Ensure the agent defines the Zod schema in `libs/core` before implementing storage logic.

### Modifying Schema
1. The agent must first update the Zod schema in `libs/core`.
2. Then, it should update the repository interface in `libs/storage`.
3. Finally, implement the platform-specific logic (Dexie for Web, SQLite for Mobile/Desktop).

---

## 🛡 Security & Compliance

- **Encryption**: AI agents must treat the `content` field of entries as an opaque blob (Phase 5 goal, but schema-ready now).
- **Secrets**: Never ask an agent to commit hardcoded secrets. Use `.env.example` as a template.
- **Conventional Commits**: Ensure the agent uses `feat:`, `fix:`, `chore:`, etc., in its change descriptions.

---

## 📚 Reference Documents

- [AGENTS.md](../../AGENTS.md): The core rules and role definition for AI agents.
- [Architecture Overview](../architecture/02-architecture.md): The system design principles.
- [Coding Standards](../../AGENTS.md#coding-standards): Language and component guidelines.
