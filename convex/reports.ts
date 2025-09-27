import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get team reports
export const getTeamReports = query({
  args: { 
    teamId: v.id("teams"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify user is team member
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => 
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .unique();

    if (!membership) return [];

    const reports = await ctx.db
      .query("reports")
      .withIndex("by_team_and_created", (q) => q.eq("teamId", args.teamId))
      .order("desc")
      .take(args.limit || 20);

    // Get query info for each report
    const reportsWithQueries = await Promise.all(
      reports.map(async (report) => {
        const query = await ctx.db.get(report.queryId);
        return {
          ...report,
          query: query ? {
            query: query.query,
            type: query.type,
            language: query.language,
          } : null,
        };
      })
    );

    return reportsWithQueries;
  },
});

// Get single report details
export const getReportDetails = query({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const report = await ctx.db.get(args.reportId);
    if (!report) return null;

    // Verify user has access
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => 
        q.eq("teamId", report.teamId).eq("userId", userId)
      )
      .unique();

    if (!membership) return null;

    // Get related query and scraped data
    const query = await ctx.db.get(report.queryId);
    const scrapedData = await ctx.db
      .query("scrapedData")
      .withIndex("by_query", (q) => q.eq("queryId", report.queryId))
      .collect();

    return {
      ...report,
      query,
      scrapedData,
    };
  },
});
