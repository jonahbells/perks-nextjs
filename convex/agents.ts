import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    return await Promise.all(
      agents.map(async (agent) => {
        const user = await ctx.db.get(agent.userId);
        return { ...agent, userName: user?.name ?? user?.email ?? "Unknown" };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.id);
    if (!agent) return null;
    const user = await ctx.db.get(agent.userId);
    return { ...agent, userName: user?.name ?? user?.email ?? "Unknown" };
  },
});

export const create = mutation({
  args: {
    userName: v.string(),
    email: v.string(),
    referralCode: v.string(),
    commissionRate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.userName,
      email: args.email,
      role: "agent",
      isActive: true,
      createdAt: Date.now(),
    });
    return await ctx.db.insert("agents", {
      userId,
      referralCode: args.referralCode,
      commissionRate: args.commissionRate,
      totalEarnings: 0,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agents"),
    referralCode: v.string(),
    commissionRate: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.id);
    if (!agent) throw new Error("Agent not found");
    await ctx.db.patch(args.id, { isActive: !agent.isActive });
  },
});
