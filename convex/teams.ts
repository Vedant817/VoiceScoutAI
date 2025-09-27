import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user's teams
export const getUserTeams = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const teams = await Promise.all(
      memberships.map(async (membership) => {
        const team = await ctx.db.get(membership.teamId);
        return team ? { ...team, role: membership.role } : null;
      })
    );

    return teams.filter(Boolean);
  },
});

// Create a new team
export const createTeam = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pay-per-use"), v.literal("team")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      description: args.description,
      ownerId: userId,
      plan: args.plan,
      credits: args.plan === "free" ? 10 : 100, // Free tier gets 10 credits, others start with 100
      createdAt: Date.now(),
    });

    // Add creator as owner
    await ctx.db.insert("teamMembers", {
      teamId,
      userId,
      role: "owner",
      joinedAt: Date.now(),
    });

    return teamId;
  },
});

// Get team details with members
export const getTeamDetails = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if user is a member of this team
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => 
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .unique();

    if (!membership) return null;

    const team = await ctx.db.get(args.teamId);
    if (!team) return null;

    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user ? { name: user.name, email: user.email } : null,
        };
      })
    );

    return {
      ...team,
      members: membersWithUsers,
      userRole: membership.role,
    };
  },
});

// Add team member
export const addTeamMember = mutation({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if current user is owner or admin
    const currentMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => 
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .unique();

    if (!currentMembership || (currentMembership.role !== "owner" && currentMembership.role !== "admin")) {
      throw new Error("Not authorized to add members");
    }

    // Find user by email
    const targetUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Check if user is already a member
    const existingMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => 
        q.eq("teamId", args.teamId).eq("userId", targetUser._id)
      )
      .unique();

    if (existingMembership) {
      throw new Error("User is already a team member");
    }

    await ctx.db.insert("teamMembers", {
      teamId: args.teamId,
      userId: targetUser._id,
      role: args.role,
      joinedAt: Date.now(),
    });

    return targetUser._id;
  },
});
