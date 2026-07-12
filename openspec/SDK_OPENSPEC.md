# OpenSpec: MusicConnect Documentation Hub

- Spec-ID: `music-connect-docs-openspec`
- Version: `2.1.0`
- Status: `Active`
- Last-Updated: `2026-07-12`

## Scope

`DancingMusic/MusicConnect` owns the public documentation page for music connector development:

- connector repository boundaries
- `MusicConnector` implementation requirements
- config schema conventions
- GitHub Pages demo requirements
- release and pinned CDN URL rules

It does not own concrete platform implementations.

## Repository Boundary

MUST:

- Publish the official connector API documentation from the unified docs site at `https://dancingmusic.github.io/docs/connectors/sdk`.
- Keep the page in `docs/index.html`.
- Use the Open Design documentation page structure: inline-start navigation, scrollable article body, inline-end table of contents.
- Link to the independent `MusicConnect-*` implementation repositories and their own demo pages.
- Point contributors back to the host OpenSpec for runtime boundaries.

MUST NOT:

- Treat this repository as a monorepo for connector implementations.
- Add new platform implementations here.
- Add this repository back as a `DancingMusic` submodule implementation dependency.

## Implementation Repositories

Concrete music connectors are independent GitHub repositories named:

```text
DancingMusic/MusicConnect-<Name>
```

Each implementation repository MUST:

- peer-depend on the canonical `@dancingmusic/music-connect` contract
- default-export a class implementing `MusicConnector`
- expose stable metadata through `meta`
- declare only capabilities that are actually implemented
- build and commit `dist/index.js`
- provide contract tests
- publish a credential-free `docs/index.html` documentation/demo page through GitHub Pages
- release immutable semver tags such as `v0.4.0`
- use distinct implementation ids for anonymous/account variants and group
  them through `familyId`

## Login persistence boundary

- Implementations own provider-specific login protocol, status and actions;
  the host owns credential persistence and non-secret usage state.
- Login/config inputs may contain user-supplied secrets, but Cookie, Token,
  password, authorization, credential and key-like fields MUST NOT be returned
  through `configPatch` or written to URLs, logs, Store records, diagnostics or
  renderer `localStorage`.
- The host persists submitted secrets under the installation id, injects them
  only through that connector's `init()` runtime config, and clears them on
  logout, uninstall and reset.
- `authState`, `lastAuthenticatedAt`, `lastUsedAt` and storage-backend identity
  are host metadata rather than connector-owned durable state.
- Public Pages MUST NOT collect or persist real platform credentials. Account
  integration is tested in the host or with mocked provider responses.
- Account implementations MAY receive a host context exposing bounded official
  provider operation IDs. Implementations MUST NOT pass arbitrary URLs,
  headers or credentials through this context. Provider cookies and request
  endpoints remain host-owned.

## Host Link Contract

The DancingMusic host should use this repository's Pages URL for official connector development documentation and specification links:

```text
https://dancingmusic.github.io/docs/connectors/sdk
```

Per-connector demo links remain tied to each implementation repository:

```text
https://dancingmusic.github.io/MusicConnect-<Name>/
```

## Release

Any change to `docs/index.html` should be pushed to `main`. The `Deploy Docs` workflow publishes the `docs/` directory to GitHub Pages.
