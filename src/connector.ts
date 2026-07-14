import type { MusicListQuery, MusicTrack } from "./types";

export type MusicConnectorCapability =
  | "search" | "stream" | "lyrics" | "playlist" | "login"
  | "user-library" | "favorites-read" | "favorites-write" | "recommendations";
export type MusicConnectorVariant = "anonymous" | "account" | "hybrid";
export type MusicConnectorAuthRequirement = "none" | "optional" | "required";
export type MusicConnectorHost = "web" | "desktop";

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

export interface MusicFavoriteTracksQuery {
  page?: number;
  pageSize?: number;
}

export interface MusicFavoriteTrackList {
  tracks: MusicTrack[];
  total: number;
  page: number;
  pageSize: number;
  /** Unix epoch milliseconds when the remote state was observed. */
  syncedAt?: number;
}

export interface MusicFavoriteMutationResult {
  /** Canonical provider-prefixed MusicTrack id. */
  trackId: string;
  /** Confirmed final remote favorite state. */
  favorite: boolean;
  /** Whether this request changed remote state, when the provider exposes it. */
  changed?: boolean;
  /** Unix epoch milliseconds when the final state was confirmed. */
  syncedAt?: number;
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
export interface MusicConnectorMembership {
  active: boolean;
  label?: string;
  tier?: string;
  expiresAt?: number;
}
export interface MusicConnectorLoginResult {
  status: MusicConnectorLoginStatus; flow?: MusicConnectorLoginFlow; flowId?: string;
  actions?: MusicConnectorLoginAction[]; user?: { id?: string; name?: string; avatarUrl?: string };
  membership?: MusicConnectorMembership;
  message?: string; expiresAt?: number; nextPollMs?: number;
  /** Non-secret configuration only. Hosts must reject Cookie/token/password values here. */
  configPatch?: Record<string, unknown>;
}

export interface MusicConnectorHostContext {
  officialProviderRequest?<T = unknown>(operation: string, params?: Record<string, unknown>): Promise<T>;
}

export interface MusicConnector {
  readonly meta: MusicConnectorMeta;
  init?(config?: Record<string, unknown>, host?: MusicConnectorHostContext): Promise<void>;
  dispose?(): void;
  search(query: MusicListQuery): Promise<MusicSearchResult>;
  getTrack(trackId: string): Promise<MusicTrack | null>;
  getStreamUrl(trackId: string): Promise<MusicStreamInfo | null>;
  getLyrics?(trackId: string): Promise<MusicLyrics | null>;
  login?(request?: MusicConnectorLoginRequest): Promise<MusicConnectorLoginResult>;
  listPlaylists?(query?: MusicPlaylistQuery): Promise<MusicPlaylistList>;
  getPlaylistTracks?(playlistId: string, opts?: { page?: number; pageSize?: number }): Promise<MusicSearchResult>;
  /** Requires the `favorites-read` capability. */
  listFavoriteTracks?(query?: MusicFavoriteTracksQuery): Promise<MusicFavoriteTrackList>;
  /**
   * Requires the `favorites-write` capability. This is an idempotent set
   * operation: `favorite` is the desired final state, never a toggle command.
   */
  setTrackFavorite?(trackId: string, favorite: boolean): Promise<MusicFavoriteMutationResult>;
}
