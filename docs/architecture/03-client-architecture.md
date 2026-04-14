# Client Architecture

## Platforms

- Web: Next.js (PWA)
- Desktop: Electron
- Mobile: React Native (Expo)

## Monorepo Structure
```
apps/
web/
desktop/
mobile/

libs/
core/
sync/
storage/
api/
crypto/
```


## Shared Libraries

### core
- Types and models

### sync
- Sync engine logic

### storage
- Local DB abstraction

### api
- HTTP client

### crypto
- Encryption logic

## Local Storage Strategy

| Platform | Storage |
|--------|--------|
| Web | IndexedDB (Dexie) |
| Desktop | SQLite |
| Mobile | SQLite |

## Design Rules

- Never fetch directly from API for UI rendering
- Always read from local DB
- Sync runs in background