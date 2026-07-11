# OpenSpec: MusicConnect Documentation Hub

- Spec-ID: `music-connect-docs-openspec`
- Version: `2.0.0`
- Status: `Active`
- Last-Updated: `2026-06-11`

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

- peer-depend on `@dancingmusic/music-store`
- default-export a class implementing `MusicConnector`
- expose stable metadata through `meta`
- declare only capabilities that are actually implemented
- build and commit `dist/index.js`
- provide contract tests
- publish its own `docs/index.html` demo through GitHub Pages
- release immutable semver tags such as `v0.4.0`

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
