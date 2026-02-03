import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMerchant = query({
  args: { merchantId: v.id("merchants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stores")
      .withIndex("by_merchantId", (q) => q.eq("merchantId", args.merchantId))
      .collect();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const stores = await ctx.db.query("stores").collect();
    return await Promise.all(
      stores.map(async (store) => {
        const merchant = await ctx.db.get(store.merchantId);
        return { ...store, merchantName: merchant?.businessName ?? "Unknown" };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("stores") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    merchantId: v.id("merchants"),
    name: v.string(),
    address: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stores", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("stores"),
    name: v.string(),
    address: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("stores") },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.id);
    if (!store) throw new Error("Store not found");
    await ctx.db.patch(args.id, { isActive: !store.isActive });
  },
});

export const remove = mutation({
  args: { id: v.id("stores") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
