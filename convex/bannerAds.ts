import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bannerAds").collect();
  },
});

export const getById = query({
  args: { id: v.id("bannerAds") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    imageUrl: v.string(),
    targetUrl: v.string(),
    placement: v.union(v.literal("home"), v.literal("merchant"), v.literal("rewards")),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bannerAds", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("bannerAds"),
    title: v.string(),
    imageUrl: v.string(),
    targetUrl: v.string(),
    placement: v.union(v.literal("home"), v.literal("merchant"), v.literal("rewards")),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("bannerAds") },
  handler: async (ctx, args) => {
    const banner = await ctx.db.get(args.id);
    if (!banner) throw new Error("Banner not found");
    await ctx.db.patch(args.id, { isActive: !banner.isActive });
  },
});

export const remove = mutation({
  args: { id: v.id("bannerAds") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
