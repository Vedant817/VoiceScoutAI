# VoiceScout AI – Hands-Free Global Market Intelligence Agent

## Overview

VoiceScout AI is a voice-activated AI agent designed for international entrepreneurs, researchers, and hackathon participants who need quick, on-the-go market intelligence without typing or screen time. Users simply call a phone number (or use a web voice interface) to query competitor analysis, industry trends, or product research. The agent scrapes real-time web data, generates insights, stores them reactively for collaboration, emails polished reports, and handles usage-based billing seamlessly.

This solves a real-world use case: In fast-paced international hackathons or global startup environments, participants often juggle ideas across time zones, languages, and devices. Traditional research tools require manual browsing and note-taking, which is inefficient during travel or brainstorming sessions. VoiceScout enables "voice-first" research—ideal for non-desk scenarios like walking between hackathon events or pitching ideas—while ensuring data privacy, multi-language support, and fair monetization for indie users.

## Unique Selling Proposition (USP)

- **Voice-First, Zero-Setup Intelligence Pipeline**: Unlike static tools like Google Alerts or paid services (e.g., SEMrush), VoiceScout delivers instant, conversational insights via phone calls in 20+ languages (leveraging Vapi's multilingual capabilities). It combines web scraping with reactive storage for real-time team sharing (e.g., hackathon teammates get live updates), and auto-bills only for what you use (e.g., per query or data volume)—no subscriptions forcing overpayment.
- **Hackathon-Ready Demo**: Judges can interact via a live phone call during your pitch, seeing scraped data visualized in real-time, emailed reports, and billing simulated. It's technical (integrates AI scraping, reactive backend, voice NLP), global (handles international queries like "Scrape EU regulations on AI startups"), and scalable (usage-based model prevents abuse).
- **Edge Over Competitors**: Tools like Perplexity.ai or Otter.ai focus on text/search or transcription; VoiceScout is purpose-built for actionable, scraped web intelligence with built-in auth, collaboration, and billing—reducing setup from days to minutes.

## Tech Stack

- **Frontend**: Next.js 14 with React Server Components
- **Backend**: Convex (reactive database and serverless functions)
- **Authentication**: Better Auth
- **Voice Interface**: Vapi AI
- **Web Scraping**: Firecrawl
- **AI Models**: OpenRouter with best free models (Google Gemini, Meta Llama)
- **Email Service**: Resend
- **Usage Billing**: Autumn Pricing
- **Deployment**: Vercel (frontend) + Convex (backend)

## Key Features & Tech Integration

1. **Voice Interaction (Vapi.ai)**:
   - Users dial a Vapi-powered number or use the web app's voice input to query in natural language, e.g., "Research top EV battery competitors in China" or "Summarize latest hackathon trends in Berlin."
   - Vapi handles transcription, multilingual support (English, Mandarin, Spanish, etc.), and conversational follow-ups (e.g., "Drill down on pricing?").
   - USP Tie-in: Enables barrier-free access for international users with accents or in noisy environments.

2. **Web Data Scraping & Extraction (Firecrawl)**:
   - On query, Vapi triggers Firecrawl to crawl target sites (e.g., competitor homepages, news articles, or forums) and extract structured data (markdown/JSON) like pricing, features, or reviews.
   - Handles dynamic sites ethically (respects robots.txt) and avoids paywalls by focusing on public data.
   - Processes results into summaries (e.g., "Competitor X offers $99/month; Y is 20% cheaper but lacks API").

3. **Reactive Backend & Data Storage (Convex)**:
   - All scraped data, user queries, and insights are stored in Convex's reactive database for real-time syncing across devices/teams.
   - Serverless functions process data (e.g., aggregate trends, generate charts) and enable collaboration—e.g., hackathon teammates see live updates without refreshing.
   - Ensures data persistence and querying efficiency for follow-up voice sessions.

4. **Secure User Authentication (Better Auth)**:
   - Framework-agnostic TypeScript auth for sign-ups (email/password, social, or anonymous for quick hackathon trials).
   - Manages sessions, roles (e.g., team admin vs. viewer), and privacy—users control data sharing.
   - Integrates seamlessly with the web dashboard for viewing stored insights.

5. **Automated Reporting & Notifications (Resend)**:
   - After each session, Resend sends transactional emails with full reports (PDF summaries, data exports, or visualizations).
   - Custom templates for branding, e.g., "Your VoiceScout Report: EV Market Insights" with attached scraped data.
   - Handles confirmations, like "Query complete—billed $0.05 for 5 pages scraped."

6. **Usage-Based Pricing & Billing (Autumn)**:
   - Autumn acts as the "pricing database," tracking usage (e.g., queries per minute, crawl depth) and integrating with Stripe for metered billing.
   - Models: Free tier (5 queries/day), pay-per-use ($0.01/query + $0.05/page scraped), or team plans.
   - Enforces limits reactively (e.g., warn via voice if nearing quota) and generates invoices—perfect for hackathon demos showing "real" monetization.

## How It Works (User Flow)

1. User signs up/authenticates via Better Auth (web or email link).
2. Dials Vapi number or starts voice session: "Scrape recent AI hackathon winners."
3. Vapi processes query → Triggers Firecrawl scrape → Convex stores/processes data.
4. Agent responds via voice with key insights; full details saved reactively.
5. Resend emails report; Autumn logs usage and bills via Stripe.
6. Team accesses shared dashboard (Convex) for collaboration.

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Convex account
- Vapi AI account
- Firecrawl account
- OpenRouter account
- Resend account
- Autumn Pricing account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd voicescout_ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

4. Initialize Convex:
   ```bash
   npx convex dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key

# Firecrawl Configuration
FIRECRAWL_API_KEY=your_firecrawl_api_key

# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key

# Autumn Configuration
AUTUMN_API_KEY=your_autumn_api_key

# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

## Deployment

### Frontend (Vercel)

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

### Backend (Convex)

1. Deploy your Convex functions:
   ```bash
   npx convex deploy
   ```

## Project Structure

```
voicescout_ai/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Dashboard pages
│   │   └── ...              # Other pages
│   └── lib/                 # Shared libraries
├── convex/                  # Convex backend functions
│   ├── auth.ts             # Authentication functions
│   ├── autumn.ts           # Usage tracking and billing
│   ├── messages.ts         # Message storage
│   ├── researchData.ts     # Research data storage
│   ├── resend.ts           # Email sending
│   ├── vapi.ts             # VAPI integration
│   ├── vapiWebhook.ts      # VAPI webhook handler
│   └── ...                 # Other Convex functions
├── public/                  # Static assets
└── ...                      # Configuration files
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signup` - Sign up user
- `POST /api/auth/signout` - Sign out user

### VAPI Integration
- `POST /api/vapi/webhook` - Handle VAPI webhooks
- `POST /api/vapi/answer` - Process user queries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub.