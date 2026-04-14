# Improvement Suggestions for Silo

Based on the system analysis, here are the strategic and technical recommendations to enhance the Silo project.

## 1. Technical Architecture Improvements

### A. Move Beyond Last-Write-Wins (LWW)
Instead of simple LWW, implement a **per-field resolution** or a **Conflict-free Replicated Data Type (CRDT)** approach earlier.
- **Suggestion:** Use `Y.js` or `Automerge` for the `content` field (TipTap JSON). This ensures that if you edit the top of a journal entry on mobile and the bottom on desktop, both changes are merged rather than one being discarded.

### B. Shift-Left on Encryption (E2EE)
Do not wait for Phase 5 to design E2EE.
- **Suggestion:** Define the "Encrypted Blob" format now. Even if Phase 1 uses a "null-cipher" (storing plain text in the blob), the sync engine should treat the data as an opaque blob from day one. This makes the transition to real E2EE a key-management change rather than a database schema change.

### C. Reliable Sync via HLC (Hybrid Logical Clocks)
To solve the clock skew problem inherent in `updatedAt` sync:
- **Suggestion:** Implement **Hybrid Logical Clocks (HLC)**. HLCs combine system time with a counter to ensure a strictly increasing order of events across distributed devices, even if their physical clocks are slightly out of sync.

### D. Unified Storage Interface
- **Suggestion:** Use an abstraction like **RxDB** or **WatermelonDB**. These libraries are designed specifically for local-first sync and handle the abstraction between IndexedDB and SQLite out of the box, including complex queries and observation.

## 2. Data Model & Integrity

### A. Versioned Schema
- **Suggestion:** Add a `schemaVersion` to the `Entry` model.
- **Suggestion:** Implement a "Migration Runner" in the `storage` library that can transform local data when the app updates.

### B. Soft Deletes
The `SyncState` mentions `deleted?`. 
- **Suggestion:** Ensure the backend never physically deletes records until all known devices have acknowledged the deletion (Tombstones).

## 3. Media & Attachments
- **Suggestion:** Implement **Lazy Loading for Attachments**. The metadata (Entry) should sync immediately, but the binary data (MinIO) should be fetched only when the user views the entry or when on unmetered Wi-Fi.

## 4. Development & DevOps

### A. Contract-First Development
- **Suggestion:** Use **OpenAPI (Swagger)** or **tRPC** to define the Sync API. This ensures the NestJS backend and the TypeScript client stay in sync regarding the API contract.

### B. Local-First Testing Suite
- **Suggestion:** Create a "Sync Simulator" test suite that artificially introduces network latency, offline periods, and conflicting writes to verify the robustness of the sync engine.

## 5. Revised Roadmap (Recommended)

1.  **Phase 1: Foundation & Local-First.** Web + Local DB + **HLC** + **CRDT-ready Editor**.
2.  **Phase 2: Sync & Auth.** Backend + **Opaque Blob Sync** + Basic Auth.
3.  **Phase 3: Security.** E2EE Key Management + Argon2/AES implementation.
4.  **Phase 4: Multi-Platform.** Desktop (Electron) & Mobile (React Native).
5.  **Phase 5: Media.** Attachments + MinIO integration.
