import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ReportViewerProps {
  reportId: Id<"reports">;
  onClose: () => void;
}

export function ReportViewer({ reportId, onClose }: ReportViewerProps) {
  const report = useQuery(api.reports.getReportDetails, { reportId });

  if (!report) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
            <p className="text-gray-600 mt-1">
              Generated on {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Query Info */}
          {report.query && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Original Query</h3>
              <p className="text-gray-700">{report.query.query}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Type: {report.query.type.replace(/_/g, ' ')}</span>
                <span>Language: {report.query.language.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* Summary */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h3>
            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              {report.insights.map((insight, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.category}</h4>
                    <span className="text-sm text-gray-500">
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{insight.finding}</p>
                  {insight.sources.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Sources: {insight.sources.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {report.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          {report.scrapedData && report.scrapedData.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Sources</h3>
              <div className="space-y-3">
                {report.scrapedData.map((source, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{source.title}</h4>
                      {source.relevanceScore && (
                        <span className="text-sm text-gray-500">
                          Relevance: {Math.round(source.relevanceScore * 100)}%
                        </span>
                      )}
                    </div>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {source.url}
                    </a>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {source.content.substring(0, 200)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Report generated by VoiceScout AI
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                Export PDF
              </button>
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                Share Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
