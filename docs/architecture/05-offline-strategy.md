# Offline Strategy

## Core Principle

Application must work fully without internet.

## Write Flow

User Action
  ↓
Write to Local DB
  ↓
Mark as DIRTY
  ↓
Queue Sync Job

## Read Flow

UI → Local DB ONLY

## Sync Trigger

- App start
- Network reconnect
- Interval-based background sync

## Failure Handling

- Retry queue
- Exponential backoff
- Conflict resolution fallback

## Benefits

- Instant UI response
- No dependency on server availability