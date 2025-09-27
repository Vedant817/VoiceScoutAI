import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

// Get team queries
export const getTeamQueries = query({
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

    const queries = await ctx.db
      .query("queries")
      .withIndex("by_team_and_created", (q) => q.eq("teamId", args.teamId))
      .order("desc")
      .take(args.limit || 50);

    // Get user info for each query
    const queriesWithUsers = await Promise.all(
      queries.map(async (query) => {
        const user = await ctx.db.get(query.userId);
        return {
          ...query,
          user: user ? { name: user.name, email: user.email } : null,
        };
      })
    );

    return queriesWithUsers;
  },
});

// Create new voice query
export const createVoiceQuery = mutation({
  args: {
    teamId: v.id("teams"),
    query: v.string(),
    type: v.union(
      v.literal("competitor_analysis"),
      v.literal("industry_trends"),
      v.literal("product_research"),
      v.literal("market_analysis")
    ),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user is team member
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => 
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .unique();

    if (!membership) throw new Error("Not a team member");

    // Check team credits
    const team = await ctx.db.get(args.teamId);
    if (!team || team.credits < 5) {
      throw new Error("Insufficient credits");
    }

    // Create query
    const queryId = await ctx.db.insert("queries", {
      teamId: args.teamId,
      userId,
      type: args.type,
      query: args.query,
      language: args.language,
      status: "processing",
      creditsUsed: 0,
      createdAt: Date.now(),
    });

    // Deduct initial credits
    await ctx.db.patch(args.teamId, {
      credits: team.credits - 5,
    });

    // Track usage
    await ctx.db.insert("usage", {
      teamId: args.teamId,
      userId,
      queryId,
      action: "voice_query",
      credits: 5,
      timestamp: Date.now(),
    });

    // Schedule processing
    await ctx.scheduler.runAfter(0, internal.processing.processQuery, {
      queryId,
    });

    return queryId;
  },
});

// Get query details with report
export const getQueryDetails = query({
  args: { queryId: v.id("queries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const query = await ctx.db.get(args.queryId);
    if (!query) return null;

    // Verify user has access
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => 
        q.eq("teamId", query.teamId).eq("userId", userId)
      )
      .unique();

    if (!membership) return null;

    // Get report if available
    const report = await ctx.db
      .query("reports")
      .withIndex("by_query", (q) => q.eq("queryId", args.queryId))
      .unique();

    // Get scraped data
    const scrapedData = await ctx.db
      .query("scrapedData")
      .withIndex("by_query", (q) => q.eq("queryId", args.queryId))
      .collect();

    const user = await ctx.db.get(query.userId);

    return {
      ...query,
      user: user ? { name: user.name, email: user.email } : null,
      report,
      scrapedData,
    };
  },
});

// Update query status
export const updateQueryStatus = mutation({
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
