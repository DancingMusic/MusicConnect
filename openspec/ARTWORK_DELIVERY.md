# OpenSpec: Connector Artwork Delivery

- Spec-ID: `music-connect-artwork-delivery`
- Version: `1.0.0`
- Status: `Active`
- Last-Updated: `2026-07-16`

## Scope

MusicConnect already carries optional provider artwork through
`MusicTrack.coverUrl` and `MusicPlaylist.coverUrl`. This specification defines
the ownership and security boundary for those URLs without adding a
provider-specific runtime API.

## Connector responsibilities

- Return the provider's real artwork URL when one is available.
- Prefer HTTPS and normalize provider-relative URLs inside the implementation.
- Preserve the selected track or playlist identity; do not substitute a generic
  host image merely because a browser cannot use the provider image in Canvas.
- Keep provider URL construction and response-field compatibility inside the
  connector implementation.
- Document every expected artwork origin and request the matching reviewed
  `permissions.artworkOrigins` entry in MusicStore.
- Never place cookies, tokens, signatures derived from host secrets, or other
  credentials in an artwork URL.

## Store and host responsibilities

`permissions.artworkOrigins` belongs to the reviewed MusicStore manifest, not
to an untrusted connector's runtime self-declaration. It is distinct from
`networkOrigins`: artwork origins authorize a narrow host-owned image resolver
and do not grant the connector Worker additional network access.

The host may resolve only the exact URL returned by the connector and only when
its HTTPS origin is present in the originating implementation's reviewed Store
record. It must not infer providers, reconstruct artwork URLs, forward account
credentials, follow undeclared redirects, or expose a generic network proxy to
plugins. Visual plugins consume the host's existing song snapshots and receive
the final current-song cover from the host.

## Compatibility

The fields remain optional and the MusicConnect TypeScript surface does not
change. Older connectors and Store records continue to work with their original
URLs. Native artwork normalization is an optional host enhancement; Web hosts
may retain the original URL or an existing fallback when source CORS prevents a
Canvas-safe load.
