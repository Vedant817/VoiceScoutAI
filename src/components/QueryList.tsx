import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface QueryListProps {
  teamId: Id<"teams">;
}

export function QueryList({ teamId }: QueryListProps) {
  const queries = useQuery(api.queries.getTeamQueries, { teamId }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
      case "scraping":
      case "analyzing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "competitor_analysis":
        return "Competitor Analysis";
      case "industry_trends":
        return "Industry Trends";
      case "product_research":
        return "Product Research";
      case "market_analysis":
        return "Market Analysis";
      default:
        return type;
    }
  };

  if (queries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No queries yet</h3>
        <p className="text-gray-600">Start by submitting your first voice query above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {queries.map((query) => (
        <div key={query._id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                  {query.status}
                </span>
                <span className="text-sm text-gray-500">
                  {getTypeLabel(query.type)}
                </span>
                <span className="text-sm text-gray-500">
                  {query.language.toUpperCase()}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{query.query}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>By {query.user?.name || "Unknown"}</span>
                <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                <span>{query.creditsUsed} credits used</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {query.status === "completed" && (
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Report
                </button>
              )}
              {query.status === "processing" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
          </div>
          
          {query.status === "completed" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <strong>Completed:</strong> {query.completedAt ? new Date(query.completedAt).toLocaleString() : "N/A"}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
