import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const ambassadors = await ctx.db.query("ambassadors").collect();
    return await Promise.all(
      ambassadors.map(async (amb) => {
        const user = await ctx.db.get(amb.userId);
        return { ...amb, userName: user?.name ?? user?.email ?? "Unknown" };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("ambassadors") },
  handler: async (ctx, args) => {
    const amb = await ctx.db.get(args.id);
    if (!amb) return null;
    const user = await ctx.db.get(amb.userId);
    return { ...amb, userName: user?.name ?? user?.email ?? "Unknown" };
  },
});

export const create = mutation({
  args: {
    userName: v.string(),
    email: v.string(),
    referralCode: v.string(),
    tier: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.userName,
      email: args.email,
      role: "ambassador",
      isActive: true,
      createdAt: Date.now(),
    });
    return await ctx.db.insert("ambassadors", {
      userId,
      referralCode: args.referralCode,
      tier: args.tier,
      totalReferrals: 0,
      totalEarnings: 0,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("ambassadors"),
    referralCode: v.string(),
    tier: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("ambassadors") },
  handler: async (ctx, args) => {
    const amb = await ctx.db.get(args.id);
    if (!amb) throw new Error("Ambassador not found");
    await ctx.db.patch(args.id, { isActive: !amb.isActive });
  },
});
