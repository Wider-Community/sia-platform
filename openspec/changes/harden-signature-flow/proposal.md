# Change: Harden signature flow

## Why
The signing feature is ~70% built (UI, PDF viewer, drag-drop field placement, signature capture, PDF assembly, public signing page, list/detail views). Six gaps remain before it is production-ready: no decline flow, tokens that never expire, no audit trail for signing resources, a stub-only resend button, the public signing page hardcoded to mockDataProvider, and signing links logged to console instead of shown to the user.

## What Changes
- Add a "Decline" button with optional reason on PublicSigningPage; update signer status to `declined` and log an activity event
- Add `expiresAt` field to signer schema (default 30 days); check expiration on PublicSigningPage and show an expired-token page
- Remove signing resources from `SKIP_ACTIVITY_LOGGING` in entity-control-layer; emit `signing_viewed`, `field_signed`, `request_declined`, `request_completed` events
- Wire resend button on SigningDetailPage to regenerate token + expiresAt and copy new link (email sending deferred to Resend integration phase)
- Fix PublicSigningPage to use the same provider toggle (`USE_MOCK ? mockDataProvider : mujarradDataProvider`) instead of hardcoded mockDataProvider
- Fix NewSigningRequestPage to display signing links in a dialog after creation instead of console.log

## Impact
- Affected specs: `signature-hardening`
- Affected code: PublicSigningPage, SigningDetailPage, NewSigningRequestPage, signer schema, entity-control-layer activity logging
