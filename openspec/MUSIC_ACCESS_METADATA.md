# OpenSpec: Music access and membership metadata

- Spec-ID: `music-access-metadata`
- Version: `1.1.0`
- Status: `Active`
- Last-Updated: `2026-07-15`

## Scope

MusicConnect carries provider facts needed for a host to explain why a track is
or is not playable. Connectors do not decide product UI and hosts do not infer
provider rights from a missing URL.

`MusicTrack.access` is optional for backward compatibility. When present it
contains one availability state: `playable`, `preview`,
`membership-required`, `copyright-restricted`, `region-restricted`, or
`unavailable`. A connector MAY add a provider-facing label, reason and required
membership tier. Restricted tracks remain in search and playlist results.

Catalog decoration and current playback state are independent dimensions.
`access.badges` carries short provider-normalized display facts such as VIP,
试听, explicit content, or an audio-quality tier. `access.availability`
continues to describe the current response's playback state. A host MUST NOT
discard a membership badge merely because the signed-in account can currently
play the track.

`access.entitlement` optionally describes whether a subscription, purchase, or
other provider entitlement is granted, required, or unknown for the current
response. `access.preview` describes whether a preview asset exists and its
optional range; a preview asset alone MUST NOT change an otherwise playable
track to `preview`.

Badge `kind` and entitlement `kind` are open strings. Hosts SHOULD style known
kinds consistently and render unknown kinds with a neutral fallback. Connector
values are display metadata only: they MUST NOT contain HTML, executable UI,
credentials, entitlement proofs, or raw provider responses.

`MusicConnectorLoginResult.membership` is optional and contains the provider
membership label, tier, active state and optional expiry. Authentication alone
MUST NOT be treated as an active membership.

Hosts use the access and membership values to label content and explain failed
playback. These fields contain no credentials and are safe as ordinary runtime
metadata. Cookie, token, key, entitlement proof and raw provider responses are
forbidden.

## Compatibility

All new fields are optional. Older connectors continue to work and older hosts
ignore the metadata. The original `label`, `requiredMembership`, and `reason`
fields remain valid compatibility fields. Connectors SHOULD return
`availability: playable` only when the provider response explicitly permits
playback; unknown responses use `unavailable` rather than guessing a
membership tier.
