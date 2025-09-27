import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Teams for collaboration
  teams: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.id("users"),
    plan: v.union(v.literal("free"), v.literal("pay-per-use"), v.literal("team")),
    credits: v.number(), // Available credits
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  // Team members
  teamMembers: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"])
    .index("by_team_and_user", ["teamId", "userId"]),

  // Voice queries and market research requests
  queries: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    type: v.union(
      v.literal("competitor_analysis"),
      v.literal("industry_trends"),
      v.literal("product_research"),
      v.literal("market_analysis")
    ),
    query: v.string(), // Original voice query
    language: v.string(), // Language code (en, es, fr, etc.)
    status: v.union(
      v.literal("processing"),
      v.literal("scraping"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    creditsUsed: v.number(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_team_and_created", ["teamId", "createdAt"]),

  // Scraped web data
  scrapedData: defineTable({
    queryId: v.id("queries"),
    url: v.string(),
    title: v.string(),
    content: v.string(),
    scrapedAt: v.number(),
    relevanceScore: v.optional(v.number()),
  }).index("by_query", ["queryId"]),

  // AI-generated insights and reports
  reports: defineTable({
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
    rawAnalysis: v.string(), // Full AI response
    emailSent: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_query", ["queryId"])
    .index("by_team", ["teamId"])
    .index("by_team_and_created", ["teamId", "createdAt"]),

  // Usage tracking for billing
  usage: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    queryId: v.optional(v.id("queries")),
    action: v.union(
      v.literal("voice_query"),
      v.literal("web_scraping"),
      v.literal("ai_analysis"),
      v.literal("email_report")
    ),
    credits: v.number(),
    timestamp: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"])
    .index("by_team_and_timestamp", ["teamId", "timestamp"]),

  // Voice call sessions (for Vapi integration)
  voiceSessions: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    sessionId: v.string(), // Vapi session ID
    phoneNumber: v.optional(v.string()),
    language: v.string(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("failed")),
    duration: v.optional(v.number()), // in seconds
    transcript: v.optional(v.string()),
    createdAt: v.number(),
    endedAt: v.optional(v.number()),
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"])
    .index("by_session_id", ["sessionId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
