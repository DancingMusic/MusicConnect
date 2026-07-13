export interface MusicListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  genre?: string;
}

export type MusicTrackAvailability =
  | "playable"
  | "preview"
  | "membership-required"
  | "copyright-restricted"
  | "region-restricted"
  | "unavailable";

export interface MusicTrackAccess {
  availability: MusicTrackAvailability;
  /** Provider-facing membership tier required for full playback. */
  requiredMembership?: string;
  /** Short host-displayable label such as VIP, SVIP, 试听, or 无版权. */
  label?: string;
  /** Safe human-readable reason. Must never contain credentials or raw responses. */
  reason?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  durationSec: number;
  price?: number;
  currency?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  access?: MusicTrackAccess;
}
