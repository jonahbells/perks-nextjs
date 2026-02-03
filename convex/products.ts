import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMerchant = query({
  args: { merchantId: v.id("merchants") },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_merchantId", (q) => q.eq("merchantId", args.merchantId))
      .collect();
    return await Promise.all(
      products.map(async (product) => {
        const store = await ctx.db.get(product.storeId);
        return { ...product, storeName: store?.name ?? "All Stores" };
      })
    );
  },
});

export const listByStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_storeId", (q) => q.eq("storeId", args.storeId))
      .collect();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return await Promise.all(
      products.map(async (product) => {
        const merchant = await ctx.db.get(product.merchantId);
        const store = await ctx.db.get(product.storeId);
        return {
          ...product,
          merchantName: merchant?.businessName ?? "Unknown",
          storeName: store?.name ?? "Unknown",
        };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    merchantId: v.id("merchants"),
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),
    pointsCost: v.number(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    description: v.string(),
    pointsCost: v.number(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    await ctx.db.patch(args.id, { isActive: !product.isActive });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
