import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TeamSelector } from "./TeamSelector";
import { VoiceInterface } from "./VoiceInterface";
import { QueryList } from "./QueryList";
import { TeamManagement } from "./TeamManagement";
import { UsageStats } from "./UsageStats";

export function Dashboard() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"queries" | "team" | "usage">("queries");
  
  const teams = useQuery(api.teams.getUserTeams) || [];
  const currentTeam = selectedTeam ? teams.find(t => t?._id === selectedTeam) : teams[0];

  // Auto-select first team if none selected
  if (!selectedTeam && teams.length > 0 && teams[0]) {
    setSelectedTeam(teams[0]._id);
  }

  if (teams.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Welcome to VoiceScout AI</h2>
          <p className="text-gray-600 mb-8">Create your first team to start using voice-powered market intelligence.</p>
          <TeamSelector onTeamChange={setSelectedTeam} />
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
            <p className="text-gray-600">Voice-powered research for {currentTeam.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Credits: <span className="font-semibold text-blue-600">{currentTeam.credits}</span>
            </div>
            <TeamSelector onTeamChange={setSelectedTeam} />
          </div>
        </div>
      </div>

      {/* Voice Interface */}
      <div className="mb-8">
        <VoiceInterface teamId={currentTeam._id} />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("queries")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "queries"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Recent Queries
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "team"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Team Management
          </button>
          <button
            onClick={() => setActiveTab("usage")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "usage"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Usage & Billing
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "queries" && <QueryList teamId={currentTeam._id} />}
        {activeTab === "team" && <TeamManagement teamId={currentTeam._id} />}
        {activeTab === "usage" && <UsageStats teamId={currentTeam._id} />}
      </div>
    </div>
  );
}
