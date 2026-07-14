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

export interface MusicTrackBadge {
  /** Open provider-normalized kind. Hosts render unknown kinds neutrally. */
  kind: string;
  /** Short display label such as VIP, SVIP, 试听, Explicit, or Hi-Res. */
  label: string;
  /** Safe human-readable explanation. */
  reason?: string;
}

export type MusicTrackEntitlementState = "granted" | "required" | "unknown";

export interface MusicTrackEntitlement {
  /** Open kind such as subscription, purchase, or account. */
  kind: string;
  state: MusicTrackEntitlementState;
  /** Provider-facing tier such as VIP or SVIP. */
  tier?: string;
}

export interface MusicTrackPreview {
  available: boolean;
  startMs?: number;
  endMs?: number;
}

export interface MusicTrackAccess {
  availability: MusicTrackAvailability;
  /** Provider-facing membership tier required for full playback. */
  requiredMembership?: string;
  /** Short host-displayable label such as VIP, SVIP, 试听, or 无版权. */
  label?: string;
  /** Safe human-readable reason. Must never contain credentials or raw responses. */
  reason?: string;
  /** Catalog/display facts independent of the current playback entitlement. */
  badges?: MusicTrackBadge[];
  /** Current response's structured entitlement state. */
  entitlement?: MusicTrackEntitlement;
  /** Preview availability; does not by itself imply preview-only playback. */
  preview?: MusicTrackPreview;
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
