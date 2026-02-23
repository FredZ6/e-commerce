# File Location Tracker

Purpose: track files newly produced by parallel sessions, and mark whether each file is safe to delete after a fully successful run plus the first push to remote.

## Status Legend
- `KEEP`: should stay in repository or environment.
- `DELETE_AFTER_PUSH1`: likely temporary/junk; delete after full validation passes and first remote push is done.
- `DELETE_NOW`: safe to remove immediately.
- `REVIEW`: unclear ownership/value; decide before push.

## Baseline Snapshot
- Captured at: `2026-02-22`
- Workspace: `/Users/fredz/Downloads/e-commerce`
- Command used: `git status --porcelain=v1 -uall`
- Result: no current untracked/new files at snapshot time.

## New File Records
| Date | File Path | Source Session/Note | Status | Why | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-02-22 | (none yet) | Baseline snapshot | KEEP | No newly created files detected | codex |
| 2026-02-22 | `/Users/fredz/Downloads/e-commerce/docs/file-location-tracker.md` | Incremental scan (`git status --porcelain=v1 -uall`) | KEEP | Tracking file; required to maintain file-location history | codex |
| 2026-02-22 | (no delta) | Incremental scan (`git status --porcelain=v1 -uall`) | KEEP | No new untracked files beyond tracker file itself | codex |
| 2026-02-23 | `/Users/fredz/Downloads/e-commerce/.env.example` | Synced Task 14 artifacts from `e-commerce-planb` | KEEP | Environment template required by compose/readme setup | codex |
| 2026-02-23 | `/Users/fredz/Downloads/e-commerce/docker-compose.yml` | Synced Task 14 artifacts from `e-commerce-planb` | KEEP | Monorepo local stack startup contract | codex |
| 2026-02-23 | `/Users/fredz/Downloads/e-commerce/docs/architecture.md` | Synced Task 14 artifacts from `e-commerce-planb` | KEEP | Resume/interview architecture deliverable | codex |
| 2026-02-23 | `/Users/fredz/Downloads/e-commerce/docs/resume-bullets.md` | Synced Task 14 artifacts from `e-commerce-planb` | KEEP | Resume deliverable | codex |
| 2026-02-23 | `/Users/fredz/Downloads/e-commerce/frontend/my-shop-frontend/Dockerfile` | Synced Task 14 artifacts from `e-commerce-planb` | KEEP | Frontend container build definition | codex |
| 2026-02-23 | `/Users/fredz/Downloads/e-commerce/backend/shop/Dockerfile` | Synced Task 14 artifacts from `e-commerce-planb` | KEEP | Backend container build definition | codex |
| 2026-02-23 | `/private/tmp/backend-shop-git-backup-20260222-190852` | Preserved nested backend repo `.git` during single-repo migration | DELETE_AFTER_PUSH1 | Safety backup; removable after first stable push in monorepo mode | codex |

## Expected Junk/Generated Locations (watch list)
These are common locations that often become `DELETE_AFTER_PUSH1` if produced only for local verification.

| Path Pattern | Default Status | Notes |
| --- | --- | --- |
| `/Users/fredz/Downloads/e-commerce/frontend/my-shop-frontend/dist/` | DELETE_AFTER_PUSH1 | Frontend build output |
| `/Users/fredz/Downloads/e-commerce/backend/shop/target/` | DELETE_AFTER_PUSH1 | Maven build output |
| `/Users/fredz/Downloads/e-commerce/**/*.log` | DELETE_AFTER_PUSH1 | Runtime/debug logs |
| `/Users/fredz/Downloads/e-commerce/**/.DS_Store` | DELETE_NOW | macOS metadata file |

## Quick Update Workflow
1. Run `git status --porcelain=v1 -uall`.
2. Add each new `??` file path into the table above.
3. Mark `KEEP` or `DELETE_AFTER_PUSH1`.
4. After successful full run and first remote push, remove all `DELETE_AFTER_PUSH1` entries/files.
