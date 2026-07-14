import { describe, expect, it } from "vitest";

import type {
  MusicConnector,
  MusicConnectorMeta,
  MusicFavoriteMutationResult,
  MusicFavoriteTrackList,
  MusicFavoriteTracksQuery,
  MusicListQuery,
  MusicSearchResult,
  MusicStreamInfo,
  MusicTrack,
} from "../src/index";

const tracks: MusicTrack[] = [
  { id: "mock:first", title: "First", artist: "Artist", durationSec: 180 },
  { id: "mock:second", title: "Second", artist: "Artist", durationSec: 210 },
];

class FavoriteSyncConnector implements MusicConnector {
  readonly meta: MusicConnectorMeta = {
    id: "mock-account",
    familyId: "mock",
    variant: "account",
    authRequirement: "required",
    name: "Mock account",
    version: "1.0.0",
    capabilities: ["search", "stream", "favorites-read", "favorites-write"],
  };

  private readonly favoriteIds = new Set([tracks[0].id]);

  async search(_query: MusicListQuery): Promise<MusicSearchResult> {
    return { tracks, total: tracks.length, page: 1, pageSize: tracks.length };
  }

  async getTrack(trackId: string): Promise<MusicTrack | null> {
    return tracks.find((track) => track.id === trackId) ?? null;
  }

  async getStreamUrl(_trackId: string): Promise<MusicStreamInfo | null> {
    return null;
  }

  async listFavoriteTracks(query: MusicFavoriteTracksQuery = {}): Promise<MusicFavoriteTrackList> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const favorites = tracks.filter((track) => this.favoriteIds.has(track.id));
    const start = (page - 1) * pageSize;
    return {
      tracks: favorites.slice(start, start + pageSize),
      total: favorites.length,
      page,
      pageSize,
      syncedAt: 1_750_000_000_000,
    };
  }

  async setTrackFavorite(trackId: string, favorite: boolean): Promise<MusicFavoriteMutationResult> {
    if (!tracks.some((track) => track.id === trackId)) {
      throw new Error("Unknown track");
    }
    const previous = this.favoriteIds.has(trackId);
    if (favorite) this.favoriteIds.add(trackId);
    else this.favoriteIds.delete(trackId);
    return {
      trackId,
      favorite,
      changed: previous !== favorite,
      syncedAt: 1_750_000_000_000,
    };
  }
}

describe("favorite track synchronization contract", () => {
  it("declares read and write capabilities independently of the legacy umbrella", () => {
    const connector = new FavoriteSyncConnector();
    expect(connector.meta.capabilities).toContain("favorites-read");
    expect(connector.meta.capabilities).toContain("favorites-write");
    expect(connector.meta.capabilities).not.toContain("user-library");
  });

  it("returns normalized paginated favorite tracks", async () => {
    const connector = new FavoriteSyncConnector();
    await connector.setTrackFavorite("mock:second", true);

    await expect(connector.listFavoriteTracks({ page: 2, pageSize: 1 })).resolves.toMatchObject({
      tracks: [{ id: "mock:second" }],
      total: 2,
      page: 2,
      pageSize: 1,
    });
  });

  it("sets the desired state idempotently instead of toggling", async () => {
    const connector = new FavoriteSyncConnector();

    await expect(connector.setTrackFavorite("mock:second", true)).resolves.toMatchObject({
      trackId: "mock:second",
      favorite: true,
      changed: true,
    });
    await expect(connector.setTrackFavorite("mock:second", true)).resolves.toMatchObject({
      trackId: "mock:second",
      favorite: true,
      changed: false,
    });
    await expect(connector.listFavoriteTracks()).resolves.toMatchObject({ total: 2 });

    await expect(connector.setTrackFavorite("mock:second", false)).resolves.toMatchObject({
      trackId: "mock:second",
      favorite: false,
      changed: true,
    });
    await expect(connector.setTrackFavorite("mock:second", false)).resolves.toMatchObject({
      trackId: "mock:second",
      favorite: false,
      changed: false,
    });
    await expect(connector.listFavoriteTracks()).resolves.toMatchObject({ total: 1 });
  });
});
