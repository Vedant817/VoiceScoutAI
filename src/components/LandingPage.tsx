import { SignInForm } from "../SignInForm";

export function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            🎤 Voice-First Market Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Market Research
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Just Ask
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Voice-activated AI agent for on-the-go market intelligence. Simply call or speak your request for competitor analysis, industry trends, or product research.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice-First Queries</h3>
            <p className="text-gray-600">
              Speak naturally in 20+ languages. Perfect for noisy environments and global teams.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Intelligence</h3>
            <p className="text-gray-600">
              Live web scraping and AI analysis deliver fresh insights in minutes, not hours.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Share insights instantly with your team. Real-time sync and automated reports.
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-12">
          <h2 className="text-2xl font-bold mb-4">Pay Only for What You Use</h2>
          <p className="text-gray-600 mb-6">
            No forced subscriptions. Transparent usage-based billing with free tier to get started.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Free</div>
              <div className="text-sm text-gray-500 mb-4">10 queries/month</div>
              <div className="text-sm text-gray-600">Perfect for trying out the platform</div>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">Pay-per-Use</div>
              <div className="text-sm text-gray-500 mb-4">$2-5 per query</div>
              <div className="text-sm text-gray-600">Scale as you need, no commitments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Team</div>
              <div className="text-sm text-gray-500 mb-4">Volume discounts</div>
              <div className="text-sm text-gray-600">Advanced collaboration features</div>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-center mb-6">Get Started</h2>
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
