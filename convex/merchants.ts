import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const merchants = await ctx.db.query("merchants").collect();
    const results = await Promise.all(
      merchants.map(async (merchant) => {
        const user = await ctx.db.get(merchant.userId);
        return { ...merchant, userName: user?.name ?? user?.email ?? "Unknown" };
      })
    );
    return results;
  },
});

export const getById = query({
  args: { id: v.id("merchants") },
  handler: async (ctx, args) => {
    const merchant = await ctx.db.get(args.id);
    if (!merchant) return null;
    const user = await ctx.db.get(merchant.userId);
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_merchantId", (q) => q.eq("merchantId", args.id))
      .collect();
    return { ...merchant, userName: user?.name ?? user?.email ?? "Unknown", stores };
  },
});

export const create = mutation({
  args: {
    businessName: v.string(),
    businessType: v.string(),
    contactEmail: v.string(),
    contactPhone: v.string(),
    address: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.userName,
      email: args.contactEmail,
      role: "merchant",
      isActive: true,
      createdAt: Date.now(),
    });
    return await ctx.db.insert("merchants", {
      userId,
      businessName: args.businessName,
      businessType: args.businessType,
      contactEmail: args.contactEmail,
      contactPhone: args.contactPhone,
      address: args.address,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("merchants"),
    businessName: v.string(),
    businessType: v.string(),
    contactEmail: v.string(),
    contactPhone: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("merchants") },
  handler: async (ctx, args) => {
    const merchant = await ctx.db.get(args.id);
    if (!merchant) throw new Error("Merchant not found");
    await ctx.db.patch(args.id, { isActive: !merchant.isActive });
  },
});
