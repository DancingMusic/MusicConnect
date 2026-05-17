import { describe, it, expect } from "vitest";
import { parseLrc, mergeLyrics } from "../lyrics-parser";

describe("parseLrc", () => {
  it("parses standard LRC format", () => {
    const lrc = `[00:12.34]第一行歌词
[00:15.00]第二行歌词
[01:02.50]第三行歌词`;

    const lines = parseLrc(lrc);

    expect(lines.length).toBe(3);
    expect(lines[0]).toEqual({ time: 12.34, text: "第一行歌词" });
    expect(lines[1]).toEqual({ time: 15, text: "第二行歌词" });
    expect(lines[2]).toEqual({ time: 62.5, text: "第三行歌词" });
  });

  it("skips empty lines and metadata", () => {
    const lrc = `[ti:Song Title]
[ar:Artist]
[00:05.00]有内容的行
[00:10.00]
[00:15.00]另一行`;

    const lines = parseLrc(lrc);
    expect(lines.length).toBe(2);
    expect(lines[0].text).toBe("有内容的行");
    expect(lines[1].text).toBe("另一行");
  });

  it("sorts lines by time", () => {
    const lrc = `[00:30.00]后面
[00:10.00]前面
[00:20.00]中间`;

    const lines = parseLrc(lrc);
    expect(lines[0].text).toBe("前面");
    expect(lines[1].text).toBe("中间");
    expect(lines[2].text).toBe("后面");
  });

  it("handles two-digit milliseconds", () => {
    const lrc = "[01:23.45]歌词";
    const lines = parseLrc(lrc);
    expect(lines[0].time).toBeCloseTo(83.45, 1);
  });

  it("handles three-digit milliseconds", () => {
    const lrc = "[01:23.456]歌词";
    const lines = parseLrc(lrc);
    expect(lines[0].time).toBeCloseTo(83.456, 2);
  });

  it("returns empty array for invalid input", () => {
    expect(parseLrc("")).toEqual([]);
    expect(parseLrc("no timestamps here")).toEqual([]);
  });
});

describe("mergeLyrics", () => {
  it("merges translated lyrics by matching timestamps", () => {
    const original = [
      { time: 10, text: "Hello" },
      { time: 20, text: "World" },
    ];
    const translated = [
      { time: 10, text: "你好" },
      { time: 20, text: "世界" },
    ];

    const merged = mergeLyrics(original, translated);

    expect(merged[0]).toEqual({ time: 10, text: "Hello", translated: "你好" });
    expect(merged[1]).toEqual({ time: 20, text: "World", translated: "世界" });
  });

  it("leaves lines without translation unchanged", () => {
    const original = [
      { time: 10, text: "Hello" },
      { time: 20, text: "World" },
    ];
    const translated = [{ time: 10, text: "你好" }];

    const merged = mergeLyrics(original, translated);

    expect(merged[0].translated).toBe("你好");
    expect(merged[1].translated).toBeUndefined();
  });

  it("handles empty translation array", () => {
    const original = [{ time: 10, text: "Hello" }];
    const merged = mergeLyrics(original, []);

    expect(merged.length).toBe(1);
    expect(merged[0].translated).toBeUndefined();
  });
});
