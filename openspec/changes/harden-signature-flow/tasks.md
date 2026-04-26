## 1. Schema and data layer
- [ ] 1.1 Add `expiresAt` field to signer schema (default 30 days from creation)
- [ ] 1.2 Remove signing resources from `SKIP_ACTIVITY_LOGGING` in entity-control-layer
- [ ] 1.3 Fix PublicSigningPage to use provider toggle instead of hardcoded mockDataProvider

## 2. Token expiration
- [ ] 2.1 Set `expiresAt` when creating signers in NewSigningRequestPage
- [ ] 2.2 Add expiration check to PublicSigningPage before rendering signing interface
- [ ] 2.3 Create expired-token error page component

## 3. Decline flow
- [ ] 3.1 Add "Decline" button and optional reason textarea to PublicSigningPage
- [ ] 3.2 Implement decline handler: update signer status to `declined`, log `request_declined` event
- [ ] 3.3 Show confirmation/thank-you state after decline

## 4. Audit trail
- [ ] 4.1 Log `signing_viewed` event when PublicSigningPage loads
- [ ] 4.2 Log `field_signed` event when a signer completes a field
- [ ] 4.3 Log `request_completed` event when all fields are signed
- [ ] 4.4 Log `request_declined` event (covered by 3.2, verify)

## 5. Resend
- [ ] 5.1 Wire resend button on SigningDetailPage to regenerate token and expiresAt
- [ ] 5.2 Copy new signing link to clipboard after regeneration

## 6. Signing link display
- [ ] 6.1 Replace console.log in NewSigningRequestPage with a dialog showing signing links
- [ ] 6.2 Add copy-to-clipboard button per signing link in the dialog
