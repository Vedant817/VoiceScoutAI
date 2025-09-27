import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface VoiceInterfaceProps {
  teamId: Id<"teams">;
}

export function VoiceInterface({ teamId }: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState<"competitor_analysis" | "industry_trends" | "product_research" | "market_analysis">("market_analysis");
  const [language, setLanguage] = useState("en");
  
  const createQuery = useMutation(api.queries.createVoiceQuery);

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would integrate with Vapi AI
    // For demo purposes, we'll simulate recording
    toast.info("Voice recording started (demo mode)");
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setQuery("Analyze the competitive landscape for AI-powered market research tools");
      toast.success("Voice query captured!");
    }, 3000);
  };

  const handleSubmitQuery = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    try {
      await createQuery({
        teamId,
        query: query.trim(),
        type: queryType,
        language,
      });
      
      toast.success("Query submitted! Processing will begin shortly.");
      setQuery("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit query");
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Voice Market Intelligence</h2>
        <p className="text-gray-600">
          Speak your research question or type it below. Our AI will scrape the web and generate insights.
        </p>
      </div>

      {/* Voice Recording Interface */}
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? "bg-red-500 animate-pulse"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
          }`}
        >
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </button>
        <p className="mt-4 text-sm text-gray-600">
          {isRecording ? "Listening..." : "Tap to speak your research question"}
        </p>
      </div>

      {/* Text Input Alternative */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Research Query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Analyze the competitive landscape for AI-powered market research tools"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Query Type
            </label>
            <select
              value={queryType}
              onChange={(e) => setQueryType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="market_analysis">Market Analysis</option>
              <option value="competitor_analysis">Competitor Analysis</option>
              <option value="industry_trends">Industry Trends</option>
              <option value="product_research">Product Research</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmitQuery}
          disabled={!query.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Submit Research Query
        </button>
      </div>

      {/* Quick Examples */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Examples:</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            "Who are the main competitors in the SaaS analytics space?",
            "What are the latest trends in sustainable packaging?",
            "Analyze the market size for AI chatbots in healthcare",
            "Research pricing strategies for B2B software companies",
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="text-left p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
