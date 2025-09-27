import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface UsageStatsProps {
  teamId: Id<"teams">;
}

export function UsageStats({ teamId }: UsageStatsProps) {
  const teamDetails = useQuery(api.teams.getTeamDetails, { teamId });
  const queries = useQuery(api.queries.getTeamQueries, { teamId, limit: 100 }) || [];

  if (!teamDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalCreditsUsed = queries.reduce((sum, query) => sum + query.creditsUsed, 0);
  const completedQueries = queries.filter(q => q.status === "completed").length;
  const thisMonthQueries = queries.filter(q => {
    const queryDate = new Date(q.createdAt);
    const now = new Date();
    return queryDate.getMonth() === now.getMonth() && queryDate.getFullYear() === now.getFullYear();
  }).length;

  const queryTypeStats = queries.reduce((acc, query) => {
    acc[query.type] = (acc[query.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Credits</p>
              <p className="text-2xl font-bold text-blue-600">{teamDetails.credits}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credits Used</p>
              <p className="text-2xl font-bold text-purple-600">{totalCreditsUsed}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Queries</p>
              <p className="text-2xl font-bold text-green-600">{queries.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-orange-600">{thisMonthQueries}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Query Types Breakdown */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Query Types Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(queryTypeStats).map(([type, count]) => {
            const percentage = queries.length > 0 ? (count / queries.length) * 100 : 0;
            const typeLabel = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium">{typeLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Current Plan</h4>
            <div className="text-2xl font-bold text-blue-600 capitalize mb-2">{teamDetails.plan}</div>
            <p className="text-sm text-gray-600">
              {teamDetails.plan === "free" && "10 queries per month included"}
              {teamDetails.plan === "pay-per-use" && "$2-5 per query, no monthly commitment"}
              {teamDetails.plan === "team" && "Volume discounts available"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Usage This Month</h4>
            <div className="text-2xl font-bold text-purple-600 mb-2">{thisMonthQueries}</div>
            <p className="text-sm text-gray-600">
              {teamDetails.plan === "free" && `${10 - thisMonthQueries} queries remaining`}
              {teamDetails.plan !== "free" && "Pay-as-you-go billing"}
            </p>
          </div>
        </div>
        
        {teamDetails.plan === "free" && thisMonthQueries >= 8 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-yellow-800">Approaching limit</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              You're close to your monthly query limit. Consider upgrading to pay-per-use for unlimited queries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
