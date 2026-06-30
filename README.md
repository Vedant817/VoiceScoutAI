# VoiceScout AI – Market Intelligence MVP

## Overview

VoiceScout AI is a focused Next.js MVP for turning a startup idea or market question into a structured market intelligence report. The current demo supports a typed research prompt and returns competitor hypotheses, market risks, positioning angles, and next steps through `POST /api/research`.

The long-term product vision remains voice-first market intelligence: a user speaks a question, the app transcribes it, enriches it with web context, generates a report, saves the result, and optionally emails or shares it. This repository now documents what is implemented today separately from planned integrations.

## Implemented Today

- Landing/dashboard shell replacing the default Create Next App screen.
- `POST /api/research` endpoint that accepts `{ "query": "..." }` and returns structured report JSON.
- Query guardrails: required input, whitespace normalization, minimum length, maximum length, bounded external-call timeouts, and safe public error messages.
- Optional OpenRouter report generation when `OPENROUTER_API_KEY` is configured.
- Optional Firecrawl search context when `FIRECRAWL_API_KEY` is configured.
- Demo-mode fallback reports so the product works locally without paid API keys.
- `.env.example` with the integration placeholders needed by the MVP roadmap.

## Planned Integrations

These features are not complete yet and should be treated as roadmap items:

- Vapi voice capture and webhook handling.
- Convex persistence and real-time collaboration.
- Resend email delivery for reports.
- Better Auth sign-in and team accounts.
- Usage quotas, billing, and analytics.
- Webhook signature validation for external callbacks.
- Role-based access control, audit logging, and formal GDPR/CCPA compliance workflows.

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS 4
- **API**: Next.js route handlers
- **Optional AI**: OpenRouter chat completions
- **Optional Search Context**: Firecrawl search API
- **Planned**: Vapi, Convex, Resend, Better Auth, billing, analytics

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Optional API keys for OpenRouter and Firecrawl

### Installation

1. Clone the repository.

   ```bash
   git clone https://github.com/Vedant817/VoiceScoutAI.git
   cd VoiceScoutAI
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Set up environment variables.

   ```bash
   cp .env.example .env.local
   ```

4. Fill in any keys you want to test.

   ```env
   OPENROUTER_API_KEY=
   FIRECRAWL_API_KEY=
   RESEND_API_KEY=
   VAPI_API_KEY=
   CONVEX_DEPLOYMENT=
   BETTER_AUTH_SECRET=
   ```

5. Start the development server.

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`.

## API Usage

### `POST /api/research`

Request:

```json
{
  "query": "Voice-first CRM for solo real estate agents"
}
```

Response:

```json
{
  "report": {
    "query": "Voice-first CRM for solo real estate agents",
    "generatedAt": "2026-06-30T00:00:00.000Z",
    "summary": "...",
    "competitors": [
      {
        "name": "Established workflow platforms",
        "rationale": "Large incumbents may already own the customer relationship and distribution channels."
      }
    ],
    "marketRisks": ["..."],
    "positioning": ["..."],
    "nextSteps": ["..."],
    "sources": [],
    "mode": "demo"
  }
}
```

Validation rules:

- `query` is required.
- `query` must be at least 8 characters.
- `query` must be 240 characters or fewer.
- External Firecrawl and OpenRouter calls are timeout-bounded.
- Public errors avoid leaking provider details or secrets.

## Product Flow

The MVP is intentionally scoped to one perfect demo flow:

> Type or speak a startup idea → get competitor list, market risks, positioning, and next steps.

Current implementation:

1. User types a startup idea into the dashboard.
2. The browser posts `{ query }` to `/api/research`.
3. The API validates the query.
4. If configured, Firecrawl provides source context.
5. If configured, OpenRouter generates a structured report.
6. If external services are unavailable or unconfigured, the API returns a safe demo report.

Future voice implementation:

1. Voice input through Vapi.
2. Transcription passed to the same `/api/research` pipeline.
3. Report saved to Convex.
4. Report shared by dashboard and optional Resend email.

## Security and Reliability Notes

Implemented:

- API key values stay server-side.
- Empty and short prompts are blocked.
- Overly long prompts are blocked.
- External calls have a timeout wrapper.
- Client receives safe error messages.

Still required before production:

- Rate limits and per-user quotas before paid external calls.
- Authentication and authorization.
- Webhook signature validation for Vapi and email callbacks.
- Persistent audit logs.
- Provider-specific retry, cost monitoring, and abuse detection.
- Legal review for compliance claims.

## Roadmap

### Phase 1: Demo-ready MVP

- ✅ Replace starter homepage with VoiceScout landing/dashboard shell.
- ✅ Add `.env.example` for expected integration keys.
- ✅ Add `POST /api/research` structured report endpoint.
- ✅ Add basic input validation, timeouts, and safe errors.
- ✅ Update README to separate implemented features from roadmap claims.

### Phase 2: Voice and persistence

- ⬜ Add Vapi voice session UI and callback route.
- ⬜ Save reports in Convex.
- ⬜ Add report history and sharing links.

### Phase 3: Production readiness

- ⬜ Add Better Auth.
- ⬜ Add rate limiting and usage quotas.
- ⬜ Add Resend email delivery.
- ⬜ Add tests and CI.
- ⬜ Add billing and analytics.
