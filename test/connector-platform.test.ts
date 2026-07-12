import { describe, expect, expectTypeOf, it } from "vitest";

import {
  MUSIC_CONNECTOR_HOSTS,
  type MusicConnectorHost,
  type MusicConnectorMeta,
} from "../src/index";

describe("music connector host platforms", () => {
  it("publishes the canonical host list including native mobile", () => {
    expect(MUSIC_CONNECTOR_HOSTS).toEqual(["web", "desktop", "ios", "android"]);
  });

  it("accepts explicit iOS and Android connector metadata", () => {
    const meta = {
      id: "example-mobile",
      name: "Example mobile connector",
      version: "1.0.0",
      capabilities: ["search", "stream"],
      supportedHosts: ["ios", "android"],
    } satisfies MusicConnectorMeta;

    expect(meta.supportedHosts).toEqual(["ios", "android"]);
    expectTypeOf(meta.supportedHosts).toMatchTypeOf<MusicConnectorHost[]>();
  });
});
