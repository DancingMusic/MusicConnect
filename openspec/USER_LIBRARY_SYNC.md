# OpenSpec: User library favorite synchronization

- Spec-ID: `user-library-favorite-sync`
- Version: `1.0.0`
- Status: `Active`
- Last-Updated: `2026-07-15`

## Scope

MusicConnect exposes an optional, provider-neutral contract for synchronizing a
signed-in user's favorite tracks. It lets a host pull the provider's current
favorite-track collection and set a track's desired favorite state. Provider
request names, raw identifiers, tokens and response fields remain inside the
connector implementation.

This contract synchronizes track favorites only. It does not define playlist
following, album collection, artist following or a general remote database.

## Capability declaration

Connectors declare only operations they actually implement:

- `favorites-read` requires `listFavoriteTracks()` and permits the host to read
  the remote favorite-track collection.
- `favorites-write` requires `setTrackFavorite()` and permits the host to set a
  remote track's desired favorite state.

The capabilities are independent. A connector MAY be read-only or write-only.
The existing `user-library` capability remains a backward-compatible umbrella
for older integrations, but it does not imply either new method. Hosts MUST
feature-detect the granular capability and method before calling it.

## Read contract

`listFavoriteTracks()` accepts provider-neutral page and page-size values and
returns `MusicTrack` records with stable, provider-prefixed track IDs. The
result includes normalized pagination and MAY include `syncedAt`, expressed as
Unix epoch milliseconds, to describe when the connector observed the remote
state.

The host MAY fetch all pages to reconcile its local liked list. An empty result
is authoritative only when the request succeeds; authentication, network and
provider errors MUST reject rather than masquerade as an empty library.

## Write contract

`setTrackFavorite(trackId, favorite)` is a set operation, not a toggle:

- `favorite: true` means the desired remote end state is favorited.
- `favorite: false` means the desired remote end state is not favorited.
- repeating the same request MUST be safe and MUST resolve to the same final
  state when the provider is reachable.

The result echoes the canonical track ID and confirmed final state. `changed`
MAY indicate whether this call changed remote state; hosts MUST NOT require it
because some providers cannot distinguish an existing state. `syncedAt` MAY
record the observation time in Unix epoch milliseconds.

A connector MUST reject when it cannot confirm the requested end state. It
MUST NOT report optimistic success while the provider mutation failed. Hosts
may update UI optimistically, but remain responsible for rollback or retry.

## Security and data boundary

Favorite APIs use the connector's existing authenticated runtime. Inputs and
outputs MUST NOT contain Cookie, Token, authorization headers, provider-private
request fields, raw provider responses or executable UI. Connectors translate
provider song identifiers internally from the public `MusicTrack.id` boundary.

## Compatibility

Both capabilities, both methods and all synchronization types are additive.
Existing connectors and hosts remain valid. Older connectors continue to use
their current behavior, while newer hosts feature-detect support and keep a
local-only favorite list when remote synchronization is unavailable.
