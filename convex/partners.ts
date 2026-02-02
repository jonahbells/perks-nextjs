import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const partners = await ctx.db.query("partners").collect();
    return await Promise.all(
      partners.map(async (partner) => {
        const user = await ctx.db.get(partner.userId);
        return { ...partner, userName: user?.name ?? user?.email ?? "Unknown" };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    const partner = await ctx.db.get(args.id);
    if (!partner) return null;
    const user = await ctx.db.get(partner.userId);
    return { ...partner, userName: user?.name ?? user?.email ?? "Unknown" };
  },
});

export const create = mutation({
  args: {
    userName: v.string(),
    email: v.string(),
    companyName: v.string(),
    partnerType: v.string(),
    revenueShare: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.userName,
      email: args.email,
      role: "partner",
      isActive: true,
      createdAt: Date.now(),
    });
    return await ctx.db.insert("partners", {
      userId,
      companyName: args.companyName,
      partnerType: args.partnerType,
      revenueShare: args.revenueShare,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("partners"),
    companyName: v.string(),
    partnerType: v.string(),
    revenueShare: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    const partner = await ctx.db.get(args.id);
    if (!partner) throw new Error("Partner not found");
    await ctx.db.patch(args.id, { isActive: !partner.isActive });
  },
});
