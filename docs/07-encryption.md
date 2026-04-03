# Encryption Strategy

## Phase 1 (MVP)
- HTTPS only

## Phase 2 (E2EE)

## Flow

User Password
   ↓
Key Derivation (Argon2)
   ↓
AES-GCM Encryption

## Data Handling

- Entries encrypted client-side
- Server stores encrypted blobs
- Keys never leave device

## Key Storage

- Derived from password
- Optional: secure storage (Keychain / Keystore)

## Risks

- Key loss = data loss
- Requires recovery strategy