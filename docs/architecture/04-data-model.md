# Data Model

## Entry

```ts
type Entry = {
  id: string
  content: any
  createdAt: number
  updatedAt: number
  tags: string[]
  mood?: number
  attachments: string[]
  version: number
}
```

## Sync Metadata
```ts
type SyncState = {
  lastSyncedAt: number
  dirty: boolean
  deleted?: boolean
}
```

## Attachment
```ts
type Attachment = {
  id: string
  entryId: string
  url: string
  type: 'image' | 'audio'
}
```

## Notes
- version enables future CRDT migration
- updatedAt used for conflict resolution
