# VoiceScout AI – Voice-First Market Intelligence Platform

## Overview

VoiceScout AI is a cutting-edge voice-activated AI agent designed for international entrepreneurs, researchers, and hackathon participants who need quick, on-the-go market intelligence without typing or screen time. Users simply call a phone number or use the web voice interface to query competitor analysis, industry trends, or product research. The agent scrapes real-time web data, generates insights, stores them reactively for collaboration, emails polished reports, and handles usage-based billing seamlessly.

## 🚀 Key Features

### Voice-First Intelligence Pipeline
- **Multi-language Voice Interface**: Speak naturally in 20+ languages using Vapi AI
- **Real-time Web Scraping**: Firecrawl integration for live data extraction
- **AI-Powered Analysis**: OpenRouter with free models (Google Gemini, Meta Llama)
- **Reactive Collaboration**: Convex backend for real-time team sharing
- **Automated Reporting**: Resend email integration for polished reports
- **Usage-Based Billing**: Autumn Pricing for transparent, pay-per-use model

### Unique Selling Propositions
- **Zero-Setup Intelligence**: Unlike static tools like Google Alerts, VoiceScout delivers instant, conversational insights
- **Hackathon-Ready Demo**: Judges can interact via live phone calls during pitches
- **Global Accessibility**: Handles international queries in multiple languages
- **Team Collaboration**: Real-time sync and shared insights across teams
- **Transparent Pricing**: No forced subscriptions, pay only for what you use

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Authentication**: Better Auth with social providers
- **Backend**: Convex (reactive database and serverless functions)
- **Voice Interface**: Vapi AI for multilingual voice processing
- **Web Scraping**: Firecrawl for ethical data extraction
- **AI Models**: OpenRouter with free models
- **Email Service**: Resend for transactional emails
- **Usage Billing**: Autumn Pricing for metered billing
- **Search**: Inkeep for semantic search and chat
- **Analytics**: Scorecard.io for usage tracking
- **Deployment**: Vercel (frontend) + Convex (backend)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Convex account
- Vapi AI account
- Firecrawl account
- OpenRouter account
- Resend account
- Autumn Pricing account
- Inkeep account (optional)
- Scorecard.io account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/voicescout-ai.git
   cd voicescout-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your API keys and configuration in `.env.local`:
   - Database URL for Better Auth
   - Social auth credentials (Google, GitHub)
   - Convex deployment URL
   - Vapi AI API key
   - Firecrawl API key
   - OpenRouter API key
   - Resend API key
   - Autumn Pricing API key
   - Inkeep API key (optional)
   - Scorecard.io API key (optional)

4. **Set up the database**
   ```bash
   npx better-auth generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start Convex development**
   ```bash
   npm run convex
   ```

The application will be available at `http://localhost:3000`.

## 📱 Usage

### Voice Queries
1. **Start a Voice Session**: Click the microphone button in the dashboard
2. **Speak Your Query**: Ask questions like "Analyze competitors in the AI market research space"
3. **Get Real-time Results**: Watch as the system scrapes data and generates insights
4. **Share with Team**: Results are automatically shared with your team members

### Team Collaboration
1. **Create a Team**: Set up your research team with different roles
2. **Invite Members**: Add colleagues via email invitations
3. **Share Insights**: All team members see real-time updates
4. **Track Usage**: Monitor team usage and costs

### Report Generation
1. **Automatic Reports**: Every query generates a comprehensive report
2. **Email Delivery**: Reports are automatically emailed to team members
3. **Export Options**: Download reports in various formats
4. **Historical Access**: Access all past reports and insights

## 🔧 Configuration

### Voice Interface (Vapi AI)
- Configure voice assistants for different languages
- Set up webhook endpoints for call processing
- Customize voice responses and interactions

### Web Scraping (Firecrawl)
- Configure scraping rules and ethical guidelines
- Set up data extraction patterns
- Monitor scraping performance and costs

### AI Analysis (OpenRouter)
- Choose between different AI models
- Configure analysis parameters
- Set up cost monitoring and limits

### Email Service (Resend)
- Set up email templates
- Configure delivery settings
- Monitor email performance

### Usage Billing (Autumn Pricing)
- Configure pricing tiers
- Set up usage limits
- Monitor billing and costs

## 🏗 Architecture

### Frontend (Next.js 15)
- **App Router**: Modern Next.js routing
- **Server Components**: Optimized performance
- **Client Components**: Interactive voice interface
- **Authentication**: Better Auth integration
- **State Management**: React hooks and context

### Backend (Convex)
- **Reactive Database**: Real-time data synchronization
- **Serverless Functions**: Scalable backend processing
- **Real-time Queries**: Live updates across clients
- **File Storage**: Audio and document storage

### Voice Processing (Vapi AI)
- **Multilingual Support**: 20+ languages
- **Voice Recognition**: High-accuracy transcription
- **Call Management**: Incoming and outgoing calls
- **Webhook Integration**: Real-time event processing

### Data Processing Pipeline
1. **Voice Input** → Vapi AI transcription
2. **Query Processing** → Convex backend
3. **Web Scraping** → Firecrawl data extraction
4. **AI Analysis** → OpenRouter model processing
5. **Report Generation** → Automated insights
6. **Email Delivery** → Resend notification
7. **Usage Tracking** → Autumn Pricing billing

## 📊 Analytics & Monitoring

### Usage Analytics (Scorecard.io)
- Track user engagement and behavior
- Monitor system performance
- Generate usage reports
- Identify optimization opportunities

### Cost Monitoring (Autumn Pricing)
- Real-time usage tracking
- Cost breakdown by service
- Billing alerts and notifications
- Usage forecasting

## 🔒 Security & Privacy

- **Authentication**: Secure user authentication with Better Auth
- **Data Encryption**: All data encrypted in transit and at rest
- **Privacy Compliance**: GDPR and CCPA compliant
- **Access Control**: Role-based team permissions
- **Audit Logging**: Comprehensive activity tracking

## 🚀 Deployment

### Production Deployment
1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy Convex functions
3. **Database**: Set up production database
4. **Monitoring**: Configure analytics and monitoring
5. **Scaling**: Set up auto-scaling for high availability

### Environment Variables
Ensure all production environment variables are set:
- Database connections
- API keys and secrets
- Webhook URLs
- Email configuration
- Monitoring endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs and feature requests on GitHub
- **Community**: Join our Discord server for community support
- **Email**: Contact support@voicescout.ai for enterprise support

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Voice interface with Vapi AI
- ✅ Web scraping with Firecrawl
- ✅ AI analysis with OpenRouter
- ✅ Team collaboration
- ✅ Usage-based billing

### Phase 2 (Next)
- 🔄 Advanced analytics dashboard
- 🔄 Custom voice assistants
- 🔄 API for third-party integrations
- 🔄 Mobile app development

### Phase 3 (Future)
- 📋 Enterprise features
- 📋 Advanced AI models
- 📋 Multi-tenant architecture
- 📋 Global deployment

---

**VoiceScout AI** - Making market intelligence as simple as asking a question. 🎤✨