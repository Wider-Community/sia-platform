## ADDED Requirements

### Requirement: Signer Decline Flow
The system SHALL allow signers to decline a signing request with an optional reason. Declining SHALL update the signer status to `declined` and log an activity event.

#### Scenario: Signer declines
- **WHEN** a signer clicks "Decline" on the public signing page and provides a reason
- **THEN** the signer's status SHALL change to `declined`
- **AND** a `request_declined` activity event SHALL be logged
- **AND** the admin SHALL be notified

### Requirement: Signing Audit Trail
The system SHALL log timestamped events for each step of the signing process: document viewed, field signed, request declined, and request completed.

#### Scenario: Signer views document
- **WHEN** a signer opens the public signing page
- **THEN** a `signing_viewed` event SHALL be logged with the signer ID and timestamp

#### Scenario: Signer signs a field
- **WHEN** a signer completes signing a field
- **THEN** a `field_signed` event SHALL be logged with field ID, signer ID, and timestamp

#### Scenario: Signing request completed
- **WHEN** all required fields have been signed by the signer
- **THEN** a `request_completed` event SHALL be logged with signer ID and timestamp

### Requirement: Token Expiration
Signing tokens SHALL have a configurable expiration period (default 30 days). Expired tokens SHALL show an error page directing the signer to contact the admin.

#### Scenario: Token expired
- **WHEN** a signer accesses a signing link after the token has expired
- **THEN** the system SHALL display an expiration message instead of the signing interface

### Requirement: Resend Signing Request
The admin SHALL be able to resend the signing link to pending signers, generating a fresh token and expiration if the original has expired.

#### Scenario: Admin resends to pending signer
- **WHEN** admin clicks "Resend" on a pending signer in the signing detail page
- **THEN** a new token and expiration SHALL be generated
- **AND** the new signing link SHALL be copied to the clipboard
- **AND** an activity event SHALL be logged

### Requirement: PublicSigningPage Provider Consistency
The PublicSigningPage SHALL use the same data provider toggle as the rest of the application instead of a hardcoded mock provider.

#### Scenario: Public page uses correct provider
- **WHEN** the application is configured to use the production data provider
- **THEN** the PublicSigningPage SHALL use the production data provider
- **AND** the page SHALL not be hardcoded to the mock data provider

### Requirement: Signing Link Display After Creation
After creating a signing request, the system SHALL display the signing links to the admin in a dialog with copy-to-clipboard functionality, instead of logging them to the console.

#### Scenario: Admin creates signing request
- **WHEN** admin completes creating a new signing request
- **THEN** the system SHALL display a dialog containing the signing links for each signer
- **AND** each link SHALL have a copy-to-clipboard button
