## Context
The signing feature has all core UI and PDF mechanics in place but lacks several hardening pieces required for production use. This design covers the six remaining gaps.

## Goals / Non-Goals
- Goals: decline flow, token expiration, audit trail, resend, provider fix, link display fix
- Non-Goals: email delivery (deferred to Resend integration phase), multi-party signing orchestration

## Decisions

### Decline flow
- Decision: Add "Decline" button and optional reason textarea to PublicSigningPage. On submit, update signer status to `declined` and log a `request_declined` activity event.
- Alternatives considered: Separate decline page -- rejected for unnecessary navigation.

### Token expiration
- Decision: Add `expiresAt` (ISO 8601 string) to the signer schema, defaulting to 30 days from creation. PublicSigningPage checks `expiresAt` before rendering; if expired, show an error page directing the signer to contact the admin.
- Alternatives considered: Server-side middleware check -- not applicable in the current client-side data-provider model.

### Audit trail
- Decision: Remove signing resources from `SKIP_ACTIVITY_LOGGING` in entity-control-layer. Add specific events: `signing_viewed` (when public page loads), `field_signed` (per field completion), `request_declined`, `request_completed`.
- Alternatives considered: Separate audit log table -- over-engineered for current scale.

### Resend
- Decision: Wire the existing resend button on SigningDetailPage to regenerate token and `expiresAt`, then copy the new link to clipboard. Actual email sending is deferred to the Resend integration phase.
- Alternatives considered: Inline email sending now -- blocked on Resend API integration.

### PublicSigningPage provider fix
- Decision: Replace hardcoded `mockDataProvider` with the same provider toggle used everywhere else (`USE_MOCK ? mockDataProvider : mujarradDataProvider`).

### NewSigningRequestPage link display
- Decision: After creation, show signing links in a dialog/modal instead of console.log. Include a copy-to-clipboard button per link.

## Risks / Trade-offs
- Token expiration is checked client-side only; a determined user could bypass it. Acceptable for current trust model; server-side enforcement comes with the API layer.
- Resend without email means admin must manually share the link. Acceptable as interim step.

## Open Questions
- None at this time.
