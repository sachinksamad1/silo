# Sync Engine

## MVP Strategy

- Timestamp-based sync
- Last-write-wins (LWW)

## Sync Cycle

1. Push local dirty entries
2. Pull remote updates
3. Merge conflicts

## Conflict Resolution

```ts
if (local.updatedAt > remote.updatedAt)
  keep local
else
  overwrite local
```

## Sync API Contract

### Push

```http
POST /sync/push
```

### Pull

```http
GET /sync/pull?since=timestamp
```

## Future Improvements
- CRDT (Y.js / Automerge)
- Delta sync
- Operational logs