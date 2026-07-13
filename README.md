# MusicConnect

MusicConnect is the canonical TypeScript protocol and documentation entry for
DancingMusic music connector development. It contains no platform implementation.

Documentation:
[https://dancingmusic.github.io/docs/connectors/sdk](https://dancingmusic.github.io/docs/connectors/sdk)

## Boundary

This repository is not a combined implementation package. Concrete connectors live in independent repositories named `DancingMusic/MusicConnect-<Name>` and are loaded by the host at runtime through pinned CDN URLs.

Implementation repositories include:

| Repo | Source | Demo |
|---|---|---|
| [MusicConnect-NetEase](https://github.com/DancingMusic/MusicConnect-NetEase) | NetEase Cloud Music | https://dancingmusic.github.io/MusicConnect-NetEase/ |
| [MusicConnect-iTunes](https://github.com/DancingMusic/MusicConnect-iTunes) | Apple iTunes Search + RSS charts | https://dancingmusic.github.io/MusicConnect-iTunes/ |
| [MusicConnect-Archive](https://github.com/DancingMusic/MusicConnect-Archive) | Internet Archive | https://dancingmusic.github.io/MusicConnect-Archive/ |
| [MusicConnect-Radio](https://github.com/DancingMusic/MusicConnect-Radio) | Radio Browser | https://dancingmusic.github.io/MusicConnect-Radio/ |
| [MusicConnect-QQMusic](https://github.com/DancingMusic/MusicConnect-QQMusic) | QQ Music | https://dancingmusic.github.io/MusicConnect-QQMusic/ |
| [MusicConnect-KuGou](https://github.com/DancingMusic/MusicConnect-KuGou) | KuGou Music | https://dancingmusic.github.io/MusicConnect-KuGou/ |
| [MusicConnect-Spotify](https://github.com/DancingMusic/MusicConnect-Spotify) | Spotify Web API | https://dancingmusic.github.io/MusicConnect-Spotify/ |

## Connector Contract

Each `MusicConnect-*` repository should:

1. Peer-depend on `@dancingmusic/music-connect`.
2. Default-export a class implementing `MusicConnector`.
3. Declare `meta.id`, `meta.name`, `meta.version`, `meta.capabilities`, and optional `meta.configSchema`.
4. Return platform-prefixed track IDs such as `netease:123456`.
5. Build and commit `dist/index.js` for CDN loading.
6. Ship contract tests for every declared capability.
7. Publish `docs/index.html` as a GitHub Pages demo.

Implementations may declare a shared `familyId` and an `anonymous`, `account`,
or `hybrid` variant. Anonymous and account artifacts keep different ids and
credential namespaces even when they target the same platform.

Tracks may include optional `access` metadata describing whether playback is
available, a preview, membership-gated, copyright-restricted,
region-restricted or unavailable. Login results may include a structured
`membership` summary. Both additions are backward-compatible and contain
display metadata only; credentials and entitlement proofs remain host-owned.

Pinned host URL example:

```text
https://cdn.jsdelivr.net/gh/DancingMusic/MusicConnect-YourName@vX.Y.Z/dist/index.js
```

See the unified documentation for the full runtime boundary:
[MusicConnect SDK and host integration](https://dancingmusic.github.io/docs/connectors/sdk).

## Login and persisted state

Connectors implement provider-specific `login()` intents and return account
status/actions. The host owns persistence:

- Cookie, Token, password, credential and API-key fields must never be returned
  through `configPatch`, written to URLs/logs, or stored in browser
  `localStorage`.
- The host stores submitted secret fields in its per-installation credential
  vault, supplies them only through that connector's `init()`, and clears them
  on logout or uninstall.
- `authState`, last authentication time and last use time are non-secret host
  metadata; connector implementations do not create a second state database.
- Public Pages are documentation/read-only demos and must not accept live user
  credentials.

## GitHub Pages

The static documentation site lives in `docs/index.html` and deploys through `.github/workflows/pages.yml` to:

```text
https://dancingmusic.github.io/docs/connectors/sdk
```

## License

MIT
