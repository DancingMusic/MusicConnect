# MusicConnect

Music data source connectors for DancingMusic — pluggable adapters for NetEase Cloud Music, and more.

Documentation (Open-Design page):
[https://dancingmusic.github.io/MusicConnect/](https://dancingmusic.github.io/MusicConnect/)

## Install

```bash
npm install @dancingmusic/music-connect @dancingmusic/music-store-sdk
```

## Quick Start

```typescript
import { MusicStoreClient } from "@dancingmusic/music-store-sdk";
import { NeteaseConnector } from "@dancingmusic/music-connect/netease";

const client = new MusicStoreClient({ baseUrl: "https://api.example.com" });

// Register the NetEase connector
const netease = new NeteaseConnector();
await client.registerConnector(netease);

// Activate it as the current data source
client.connectors.activate("netease-cloud-music");

// Search for music
const result = await client.search({ keyword: "周杰伦" });
console.log(result.tracks);

// Get stream URL
const stream = await client.getStreamUrl("netease:123456");
console.log(stream?.url);

// Get lyrics
const lyrics = await client.getLyrics("netease:123456");
console.log(lyrics?.timeline);
```

## Custom API Base URL

```typescript
const netease = new NeteaseConnector();
await netease.init({ apiBaseUrl: "https://your-netease-api.example.com" });
await client.registerConnector(netease);
```

## Available Connectors

| Connector | ID | Capabilities |
|---|---|---|
| NetEase Cloud Music | `netease-cloud-music` | search, stream, lyrics |

## Creating a Connector

Implement the `MusicConnector` interface from `@dancingmusic/music-store-sdk`:

```typescript
import type { MusicConnector } from "@dancingmusic/music-store-sdk";

export class MyConnector implements MusicConnector {
  readonly meta = {
    id: "my-source",
    name: "My Music Source",
    version: "0.1.0",
    capabilities: ["search", "stream"] as const,
  };

  async search(query) { /* ... */ }
  async getTrack(trackId) { /* ... */ }
  async getStreamUrl(trackId) { /* ... */ }
}
```

## License

MIT
