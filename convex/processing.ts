import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

// Process a voice query through the pipeline
export const processQuery = internalAction({
  args: { queryId: v.id("queries") },
  handler: async (ctx, args) => {
    try {
      // Get query details
      const query = await ctx.runQuery(internal.processing.getQueryForProcessing, {
        queryId: args.queryId,
      });

      if (!query) {
        throw new Error("Query not found");
      }

      // Update status to scraping
      await ctx.runMutation(internal.processing.updateQueryStatus, {
        queryId: args.queryId,
        status: "scraping",
      });

      // Scrape web data (simulate for now)
      const scrapedData = await scrapeWebData(query.query, query.type);
      
      // Store scraped data
      for (const data of scrapedData) {
        await ctx.runMutation(internal.processing.storeScrapedData, {
          queryId: args.queryId,
          url: data.url,
          title: data.title,
          content: data.content,
          relevanceScore: data.relevanceScore,
        });
      }

      // Update status to analyzing
      await ctx.runMutation(internal.processing.updateQueryStatus, {
        queryId: args.queryId,
        status: "analyzing",
      });

      // Generate AI insights
      const analysis = await generateAIAnalysis(query.query, query.type, scrapedData);

      // Create report
      await ctx.runMutation(internal.processing.createReport, {
        queryId: args.queryId,
        teamId: query.teamId,
        title: analysis.title,
        summary: analysis.summary,
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        rawAnalysis: analysis.rawAnalysis,
      });

      // Update status to completed
      await ctx.runMutation(internal.processing.updateQueryStatus, {
        queryId: args.queryId,
        status: "completed",
        creditsUsed: 15, // Total credits used for processing
      });

      // Schedule email report
      await ctx.scheduler.runAfter(1000, internal.processing.sendEmailReport, {
        queryId: args.queryId,
      });

    } catch (error) {
      console.error("Query processing failed:", error);
      await ctx.runMutation(internal.processing.updateQueryStatus, {
        queryId: args.queryId,
        status: "failed",
      });
    }
  },
});

// Get query for processing (internal)
export const getQueryForProcessing = internalQuery({
  args: { queryId: v.id("queries") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.queryId);
  },
});

// Update query status (internal)
export const updateQueryStatus = internalMutation({
  args: {
    queryId: v.id("queries"),
    status: v.union(
      v.literal("processing"),
      v.literal("scraping"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    creditsUsed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: args.status };
    
    if (args.creditsUsed !== undefined) {
      updates.creditsUsed = args.creditsUsed;
    }
    
    if (args.status === "completed" || args.status === "failed") {
      updates.completedAt = Date.now();
    }

    await ctx.db.patch(args.queryId, updates);
  },
});

// Store scraped data (internal)
export const storeScrapedData = internalMutation({
  args: {
    queryId: v.id("queries"),
    url: v.string(),
    title: v.string(),
    content: v.string(),
    relevanceScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("scrapedData", {
      queryId: args.queryId,
      url: args.url,
      title: args.title,
      content: args.content,
      scrapedAt: Date.now(),
      relevanceScore: args.relevanceScore,
    });
  },
});

// Create report (internal)
export const createReport = internalMutation({
  args: {
    queryId: v.id("queries"),
    teamId: v.id("teams"),
    title: v.string(),
    summary: v.string(),
    insights: v.array(v.object({
      category: v.string(),
      finding: v.string(),
      confidence: v.number(),
      sources: v.array(v.string()),
    })),
    recommendations: v.array(v.string()),
    rawAnalysis: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reports", {
      queryId: args.queryId,
      teamId: args.teamId,
      title: args.title,
      summary: args.summary,
      insights: args.insights,
      recommendations: args.recommendations,
      rawAnalysis: args.rawAnalysis,
      emailSent: false,
      createdAt: Date.now(),
    });
  },
});

// Send email report (internal)
export const sendEmailReport = internalAction({
  args: { queryId: v.id("queries") },
  handler: async (ctx, args) => {
    // This would integrate with Resend to send email reports
    // For now, just mark as sent
    const report = await ctx.runQuery(internal.processing.getReportByQuery, {
      queryId: args.queryId,
    });

    if (report) {
      await ctx.runMutation(internal.processing.markEmailSent, {
        reportId: report._id,
      });
    }
  },
});

// Get report by query (internal)
export const getReportByQuery = internalQuery({
  args: { queryId: v.id("queries") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_query", (q) => q.eq("queryId", args.queryId))
      .unique();
  },
});

// Mark email as sent (internal)
export const markEmailSent = internalMutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, { emailSent: true });
  },
});

// Simulate web scraping (replace with Firecrawl integration)
async function scrapeWebData(query: string, type: string) {
  // This would integrate with Firecrawl API
  // For now, return mock data
  return [
    {
      url: "https://example.com/market-research",
      title: `Market Research: ${query}`,
      content: `Detailed analysis of ${query} showing current market trends and competitive landscape...`,
      relevanceScore: 0.95,
    },
    {
      url: "https://example.com/competitor-analysis",
      title: `Competitor Analysis: ${query}`,
      content: `Comprehensive competitor analysis for ${query} including key players and market positioning...`,
      relevanceScore: 0.88,
    },
  ];
}

// Simulate AI analysis (replace with OpenRouter integration)
async function generateAIAnalysis(query: string, type: string, scrapedData: any[]) {
  // This would integrate with OpenRouter API
  // For now, return mock analysis
  return {
    title: `Market Intelligence Report: ${query}`,
    summary: `Based on our analysis of current market data, ${query} shows significant opportunities for growth with emerging trends in digital transformation and consumer behavior shifts.`,
    insights: [
      {
        category: "Market Size",
        finding: "The market is valued at approximately $2.5B with 15% YoY growth",
        confidence: 0.85,
        sources: ["https://example.com/market-research"],
      },
      {
        category: "Competition",
        finding: "Top 3 competitors control 60% of market share",
        confidence: 0.78,
        sources: ["https://example.com/competitor-analysis"],
      },
    ],
    recommendations: [
      "Focus on underserved market segments",
      "Invest in digital marketing channels",
      "Consider strategic partnerships",
    ],
    rawAnalysis: "Full AI analysis would be stored here...",
  };
}
