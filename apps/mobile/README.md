# Silo Mobile

Expo / React Native client for the Silo journal workspace.

## What it implements

- Local-first journal timeline
- Native compose and edit flows
- SQLite-backed entry storage via `libs/storage`
- Manual sync surface wired to `libs/sync` and `libs/api-client`

## Run

1. Install workspace dependencies from the repo root:

```bash
pnpm install
```

2. Start the app:

```bash
pnpm --dir apps/mobile start
```

3. Optional sync setup:

- Set `EXPO_PUBLIC_API_URL` before launch, or
- Enter the API base URL in the Sync tab inside the app

## Architecture notes

- UI reads from the local SQLite-backed repository only.
- Writes mark entries `dirty` before any network call.
- Sync is explicit and background-safe, but never the render source.
