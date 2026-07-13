# OpenSpec: Music access and membership metadata

- Spec-ID: `music-access-metadata`
- Version: `1.0.0`
- Status: `Active`
- Last-Updated: `2026-07-14`

## Scope

MusicConnect carries provider facts needed for a host to explain why a track is
or is not playable. Connectors do not decide product UI and hosts do not infer
provider rights from a missing URL.

`MusicTrack.access` is optional for backward compatibility. When present it
contains one availability state: `playable`, `preview`,
`membership-required`, `copyright-restricted`, `region-restricted`, or
`unavailable`. A connector MAY add a provider-facing label, reason and required
membership tier. Restricted tracks remain in search and playlist results.

`MusicConnectorLoginResult.membership` is optional and contains the provider
membership label, tier, active state and optional expiry. Authentication alone
MUST NOT be treated as an active membership.

Hosts use the access and membership values to label content and explain failed
playback. These fields contain no credentials and are safe as ordinary runtime
metadata. Cookie, token, key, entitlement proof and raw provider responses are
forbidden.

## Compatibility

All new fields are optional. Older connectors continue to work and older hosts
ignore the metadata. Connectors SHOULD return `availability: playable` only
when the provider response explicitly permits playback; unknown responses use
`unavailable` rather than guessing a membership tier.
