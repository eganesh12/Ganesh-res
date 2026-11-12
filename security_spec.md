# Security Specification

## Data Invariants
1. A **ContactViewer** document tracking unauthorized access must not exist. Every contactViewer log entry must be created by a signed-in user whose authenticated UID or email matches the data.
2. A **ContactMessage** must be associated with the active user's credentials, ensuring validation on sender info and size parameters.
3. System-wide administrative access is strictly reserved for the owner account: `eganesh7997@gmail.com`.

## Security Rules
We enforce a default-deny policy, validating all inbound schemas and verifying user email confirmations before allowing writes.

### `contactViewers` Path Rules
- **Create**: Allowed if authenticated, inputs match the active user profile, and `id` corresponds to a standard safe pattern.
- **Read**: Logged in user can view their own, or the Administrator (`eganesh7997@gmail.com` with verified email) can read and list all logs.
- **Update/Delete**: Strictly denied for general users.

### `contacts` Path Rules
- **Create**: Allowed if authenticated, parameters (Name, Email, Message payload) are under size limits.
- **Read**: Strictly limited to the Administrator (`eganesh7997@gmail.com`).
- **Update/Delete**: Strictly denied.
