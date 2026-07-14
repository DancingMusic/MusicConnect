# MusicConnect Documentation Tasks

- Last-Updated: `2026-07-15`

## Milestone A — Documentation Hub

- [x] Publish `docs/index.html` as the official MusicConnect API documentation page.
- [x] Use the Open Design documentation layout: inline-start nav, scrollable article body, inline-end table of contents.
- [x] Document that `MusicConnect-*` repositories are independent implementations, not subdirectories or submodules of this repository.
- [x] Link all official connector repositories and their own GitHub Pages demos.

## Milestone B — Host Integration

- [x] Define the host link contract for official connector development docs:
  - `https://dancingmusic.github.io/docs/connectors/sdk`
- [ ] Keep the DancingMusic host aligned when connector documentation anchors change.
- [x] Define provider-neutral, idempotent favorite-track read/write synchronization.

## Milestone C — Maintenance

- [x] Document host-owned secret persistence and non-secret usage/account state.
- [ ] Review the page when `MusicStore` changes the `MusicConnector` contract.
- [ ] Add changelog notes when the official connector release workflow changes.
- [ ] Keep the official connector index in sync with `DancingMusic` default records.
