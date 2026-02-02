import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    role: v.optional(
      v.union(
        v.literal("admin"),
        v.literal("merchant"),
        v.literal("agent"),
        v.literal("ambassador"),
        v.literal("partner")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.role) {
      return await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", args.role!))
        .collect();
    }
    return await ctx.db.query("users").collect();
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("merchant"),
      v.literal("agent"),
      v.literal("ambassador"),
      v.literal("partner")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { role: args.role });
  },
});

export const toggleActive = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) throw new Error("User not found");
    await ctx.db.patch(args.id, { isActive: !user.isActive });
  },
});
