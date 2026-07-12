import type { MusicListQuery, MusicTrack } from "./types";

export type MusicConnectorCapability =
  | "search" | "stream" | "lyrics" | "playlist" | "login"
  | "user-library" | "recommendations";
export type MusicConnectorVariant = "anonymous" | "account" | "hybrid";
export type MusicConnectorAuthRequirement = "none" | "optional" | "required";
/**
 * Host runtimes on which a connector implementation has been validated.
 *
 * Mobile support is opt-in: hosts must not infer `ios` or `android` support
 * when an older connector omits `supportedHosts`.
 */
export const MUSIC_CONNECTOR_HOSTS = ["web", "desktop", "ios", "android"] as const;
export type MusicConnectorHost = (typeof MUSIC_CONNECTOR_HOSTS)[number];

export interface ConnectorConfigField {
  key: string;
  label: string;
  type?: "text" | "url" | "password";
  required?: boolean;
  placeholder?: string;
  default?: string;
  help?: string;
}

export interface MusicConnectorMeta {
  id: string;
  familyId?: string;
  variant?: MusicConnectorVariant;
  authRequirement?: MusicConnectorAuthRequirement;
  /**
   * Explicitly validated host runtimes. Omission keeps the legacy
   * `web`/`desktop` compatibility default and never opts into mobile.
   */
  supportedHosts?: MusicConnectorHost[];
  name: string;
  icon?: string;
  description?: string;
  version: string;
  capabilities: MusicConnectorCapability[];
  configSchema?: ConnectorConfigField[];
}

export interface MusicSearchResult { tracks: MusicTrack[]; total: number; page: number; pageSize: number; }
export interface MusicStreamInfo { url: string; format: string; bitrate?: number; expiresAt?: number; }
export interface LyricLine { time: number; text: string; translated?: string; }
export interface MusicLyrics { text: string; translated?: string; timeline?: LyricLine[]; }
export interface MusicPlaylist {
  id: string; name: string; description?: string; coverUrl?: string;
  trackCount?: number; curator?: string; externalUrl?: string;
}
export interface MusicPlaylistList { playlists: MusicPlaylist[]; total: number; page: number; pageSize: number; }
export interface MusicPlaylistQuery {
  category?: string; page?: number; pageSize?: number; sort?: "hot" | "new" | "trending";
}

export type MusicConnectorLoginStatus = "unsupported" | "anonymous" | "pending" | "authenticated" | "expired" | "error";
export type MusicConnectorLoginIntent = "status" | "start" | "continue" | "cancel" | "logout";
export type MusicConnectorLoginFlow = "qr" | "oauth" | "browser" | "device-code" | "manual-token" | "custom";
export type MusicConnectorLoginActionType = "qr" | "open-url" | "manual-input" | "message";
export type MusicConnectorLoginCookieProvider = "netease" | "qq-music" | "kugou" | "apple-music" | "custom" | string;

export interface MusicConnectorLoginRequest { intent?: MusicConnectorLoginIntent; flowId?: string; input?: Record<string, unknown>; }
export interface MusicConnectorLoginCookieCapture {
  provider?: MusicConnectorLoginCookieProvider; url?: string; title?: string; partition?: string;
  domains?: string[]; requiredCookieNames?: string[]; playbackCookieNames?: string[];
  cookieNames?: string[]; warmupUrl?: string; message?: string;
}
export interface MusicConnectorLoginAction {
  type: MusicConnectorLoginActionType; label?: string; qrUrl?: string; imageUrl?: string;
  url?: string; cookieCapture?: MusicConnectorLoginCookieCapture; fields?: ConnectorConfigField[]; message?: string;
}
export interface MusicConnectorLoginResult {
  status: MusicConnectorLoginStatus; flow?: MusicConnectorLoginFlow; flowId?: string;
  actions?: MusicConnectorLoginAction[]; user?: { id?: string; name?: string; avatarUrl?: string };
  message?: string; expiresAt?: number; nextPollMs?: number;
  /** Non-secret configuration only. Hosts must reject Cookie/token/password values here. */
  configPatch?: Record<string, unknown>;
}

export interface MusicConnector {
  readonly meta: MusicConnectorMeta;
  init?(config?: Record<string, unknown>): Promise<void>;
  dispose?(): void;
  search(query: MusicListQuery): Promise<MusicSearchResult>;
  getTrack(trackId: string): Promise<MusicTrack | null>;
  getStreamUrl(trackId: string): Promise<MusicStreamInfo | null>;
  getLyrics?(trackId: string): Promise<MusicLyrics | null>;
  login?(request?: MusicConnectorLoginRequest): Promise<MusicConnectorLoginResult>;
  listPlaylists?(query?: MusicPlaylistQuery): Promise<MusicPlaylistList>;
  getPlaylistTracks?(playlistId: string, opts?: { page?: number; pageSize?: number }): Promise<MusicSearchResult>;
}
