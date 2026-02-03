import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("earn"), v.literal("redeem"), v.literal("refund"))),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("refunded")
      )
    ),
  },
  handler: async (ctx, args) => {
    let transactions = await ctx.db.query("transactions").collect();
    if (args.type) {
      transactions = transactions.filter((t) => t.type === args.type);
    }
    if (args.status) {
      transactions = transactions.filter((t) => t.status === args.status);
    }
    const results = await Promise.all(
      transactions.map(async (txn) => {
        const customer = await ctx.db.get(txn.customerId);
        const merchant = await ctx.db.get(txn.merchantId);
        const store = await ctx.db.get(txn.storeId);
        return {
          ...txn,
          customerName: customer
            ? `${customer.firstName} ${customer.lastName}`
            : "Unknown",
          merchantName: merchant?.businessName ?? "Unknown",
          storeName: store?.name ?? "Unknown",
        };
      })
    );
    return results;
  },
});

export const getById = query({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    const txn = await ctx.db.get(args.id);
    if (!txn) return null;
    const customer = await ctx.db.get(txn.customerId);
    const merchant = await ctx.db.get(txn.merchantId);
    return {
      ...txn,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown",
      merchantName: merchant?.businessName ?? "Unknown",
    };
  },
});
