import { query } from "./_generated/server";

export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const merchants = await ctx.db.query("merchants").collect();
    const customers = await ctx.db.query("customers").collect();
    const transactions = await ctx.db.query("transactions").collect();

    const activeMerchants = merchants.filter((m) => m.isActive).length;
    const totalRevenue = transactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers: users.length,
      totalMerchants: merchants.length,
      activeMerchants,
      totalCustomers: customers.length,
      totalTransactions: transactions.length,
      totalRevenue,
    };
  },
});
