import { describe, it, expect, vi, beforeEach } from "vitest";
import { NeteaseConnector } from "../index";
import type { NeteaseSearchResponse, NeteaseDetailResponse, NeteaseUrlResponse, NeteaseLyricResponse } from "../api";

const mockSearch: NeteaseSearchResponse = {
  code: 200,
  result: {
    songCount: 100,
    songs: [
      {
        id: 12345,
        name: "晴天",
        ar: [{ id: 1, name: "周杰伦" }],
        al: { id: 10, name: "叶惠美" },
        dt: 269000,
        fee: 0,
      },
      {
        id: 67890,
        name: "七里香",
        ar: [{ id: 1, name: "周杰伦" }],
        al: { id: 20, name: "七里香" },
        dt: 299000,
        fee: 0,
      },
    ],
  },
};

const mockDetail: NeteaseDetailResponse = {
  code: 200,
  songs: [
    {
      id: 12345,
      name: "晴天",
      ar: [{ id: 1, name: "周杰伦" }],
      al: { id: 10, name: "叶惠美", picUrl: "https://img.example.com/cover.jpg" },
      dt: 269000,
      fee: 0,
    },
  ],
};

const mockUrl: NeteaseUrlResponse = {
  code: 200,
  data: [
    {
      id: 12345,
      url: "https://music.163.com/song/media/outer/url?id=12345.mp3",
      br: 320000,
      type: "mp3",
      expi: 1200,
    },
  ],
};

const mockLyric: NeteaseLyricResponse = {
  code: 200,
  lrc: {
    lyric: `[00:00.00]晴天 - 周杰伦
[00:12.50]故事的小黄花
[00:16.30]从出生那年就飘着`,
  },
  tlyric: {
    lyric: `[00:12.50]The little yellow flower of the story
[00:16.30]Has been floating since the year of birth`,
  },
};

function mockFetch(responses: Record<string, unknown>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = typeof input === "string" ? input : input.toString();
    for (const [pattern, data] of Object.entries(responses)) {
      if (url.includes(pattern)) {
        return {
          ok: true,
          json: () => Promise.resolve(data),
        } as Response;
      }
    }
    return { ok: false, status: 404, statusText: "Not Found" } as Response;
  });
}

describe("NeteaseConnector", () => {
  let connector: NeteaseConnector;

  beforeEach(async () => {
    connector = new NeteaseConnector();
    await connector.init({ apiBaseUrl: "https://mock-api.test" });
    vi.restoreAllMocks();
  });

  it("has correct meta info", () => {
    expect(connector.meta.id).toBe("netease-cloud-music");
    expect(connector.meta.name).toBe("网易云音乐");
    expect(connector.meta.capabilities).toContain("search");
    expect(connector.meta.capabilities).toContain("stream");
    expect(connector.meta.capabilities).toContain("lyrics");
  });

  describe("search", () => {
    it("searches and returns mapped tracks", async () => {
      mockFetch({ "/cloudsearch": mockSearch });

      const result = await connector.search({ keyword: "周杰伦", pageSize: 10 });

      expect(result.total).toBe(100);
      expect(result.tracks.length).toBe(2);
      expect(result.tracks[0].id).toBe("netease:12345");
      expect(result.tracks[0].title).toBe("晴天");
      expect(result.tracks[0].artist).toBe("周杰伦");
      expect(result.tracks[0].album).toBe("叶惠美");
      expect(result.tracks[0].durationSec).toBe(269);
    });

    it("returns empty result for empty keyword", async () => {
      const result = await connector.search({ keyword: "" });

      expect(result.tracks).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("handles API error gracefully", async () => {
      mockFetch({ "/cloudsearch": { code: 400, result: null } });

      const result = await connector.search({ keyword: "test" });
      expect(result.tracks).toEqual([]);
    });
  });

  describe("getTrack", () => {
    it("fetches track detail with netease: prefix", async () => {
      mockFetch({ "/song/detail": mockDetail });

      const track = await connector.getTrack("netease:12345");

      expect(track).not.toBeNull();
      expect(track!.id).toBe("netease:12345");
      expect(track!.title).toBe("晴天");
    });

    it("fetches track detail without prefix", async () => {
      mockFetch({ "/song/detail": mockDetail });

      const track = await connector.getTrack("12345");

      expect(track).not.toBeNull();
      expect(track!.id).toBe("netease:12345");
    });

    it("returns null for invalid id", async () => {
      const track = await connector.getTrack("invalid");
      expect(track).toBeNull();
    });
  });

  describe("getStreamUrl", () => {
    it("returns stream info", async () => {
      mockFetch({ "/song/url": mockUrl });

      const stream = await connector.getStreamUrl("netease:12345");

      expect(stream).not.toBeNull();
      expect(stream!.url).toContain("12345");
      expect(stream!.format).toBe("mp3");
      expect(stream!.bitrate).toBe(320000);
    });

    it("returns null when no URL available", async () => {
      mockFetch({
        "/song/url": {
          code: 200,
          data: [{ id: 12345, url: null, br: 0, type: "", expi: 0 }],
        },
      });

      const stream = await connector.getStreamUrl("netease:12345");
      expect(stream).toBeNull();
    });
  });

  describe("getLyrics", () => {
    it("returns lyrics with translated timeline", async () => {
      mockFetch({ "/lyric": mockLyric });

      const lyrics = await connector.getLyrics("netease:12345");

      expect(lyrics).not.toBeNull();
      expect(lyrics!.text).toContain("故事的小黄花");
      expect(lyrics!.translated).toContain("little yellow flower");
      expect(lyrics!.timeline!.length).toBe(3);
      expect(lyrics!.timeline![0].text).toBe("晴天 - 周杰伦");
      expect(lyrics!.timeline![1].text).toBe("故事的小黄花");
      expect(lyrics!.timeline![1].translated).toBe("The little yellow flower of the story");
    });

    it("returns lyrics without translation", async () => {
      mockFetch({
        "/lyric": { code: 200, lrc: { lyric: "[00:10.00]只有原文" } },
      });

      const lyrics = await connector.getLyrics("netease:12345");

      expect(lyrics).not.toBeNull();
      expect(lyrics!.translated).toBeUndefined();
      expect(lyrics!.timeline![0].text).toBe("只有原文");
      expect(lyrics!.timeline![0].translated).toBeUndefined();
    });

    it("returns null when no lyrics", async () => {
      mockFetch({ "/lyric": { code: 200 } });

      const lyrics = await connector.getLyrics("netease:12345");
      expect(lyrics).toBeNull();
    });
  });

  describe("full integration flow", () => {
    it("search → detail → stream → lyrics", async () => {
      mockFetch({
        "/cloudsearch": mockSearch,
        "/song/detail": mockDetail,
        "/song/url": mockUrl,
        "/lyric": mockLyric,
      });

      // 1. Search
      const searchResult = await connector.search({ keyword: "晴天" });
      expect(searchResult.tracks.length).toBeGreaterThan(0);

      const trackId = searchResult.tracks[0].id;
      expect(trackId).toBe("netease:12345");

      // 2. Get detail
      const detail = await connector.getTrack(trackId);
      expect(detail!.title).toBe("晴天");

      // 3. Get stream
      const stream = await connector.getStreamUrl(trackId);
      expect(stream!.format).toBe("mp3");

      // 4. Get lyrics
      const lyrics = await connector.getLyrics(trackId);
      expect(lyrics!.timeline!.length).toBeGreaterThan(0);
      expect(lyrics!.timeline![1].translated).toBeTruthy();
    });
  });
});
