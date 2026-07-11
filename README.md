# MusicConnect

MusicConnect is the official documentation hub for DancingMusic music connector development.

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
| [MusicConnect-Spotify](https://github.com/DancingMusic/MusicConnect-Spotify) | Spotify Web API | https://dancingmusic.github.io/MusicConnect-Spotify/ |

## Connector Contract

Each `MusicConnect-*` repository should:

1. Peer-depend on `@dancingmusic/music-store`.
2. Default-export a class implementing `MusicConnector`.
3. Declare `meta.id`, `meta.name`, `meta.version`, `meta.capabilities`, and optional `meta.configSchema`.
4. Return platform-prefixed track IDs such as `netease:123456`.
5. Build and commit `dist/index.js` for CDN loading.
6. Ship contract tests for every declared capability.
7. Publish `docs/index.html` as a GitHub Pages demo.

Pinned host URL example:

```text
https://cdn.jsdelivr.net/gh/DancingMusic/MusicConnect-YourName@vX.Y.Z/dist/index.js
```

See the main OpenSpec for the full runtime boundary:
[DancingMusic/openspec/STORE_SDK_OPENSPEC.md](https://github.com/DancingMusic/DancingMusic/blob/main/openspec/STORE_SDK_OPENSPEC.md).

## GitHub Pages

The static documentation site lives in `docs/index.html` and deploys through `.github/workflows/pages.yml` to:

```text
https://dancingmusic.github.io/docs/connectors/sdk
```

## License

MIT
