"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { StatsCard } from "@/components/dashboard/stats-card";
import { MiniChart } from "@/components/dashboard/mini-chart";

const monthlyData = [
  { name: "Jan", value: 4200 },
  { name: "Feb", value: 5100 },
  { name: "Mar", value: 4800 },
  { name: "Apr", value: 6300 },
  { name: "May", value: 5900 },
  { name: "Jun", value: 7200 },
];

const userGrowth = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 180 },
  { name: "Mar", value: 240 },
  { name: "Apr", value: 310 },
  { name: "May", value: 420 },
  { name: "Jun", value: 530 },
];

export default function AdminDashboard() {
  const stats = useQuery(api.dashboard.adminStats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide overview and management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats ? stats.totalUsers.toLocaleString() : "—"}
          icon="Users"
        />
        <StatsCard
          title="Revenue"
          value={stats ? `$${stats.totalRevenue.toLocaleString()}` : "—"}
          icon="DollarSign"
        />
        <StatsCard
          title="Transactions"
          value={stats ? stats.totalTransactions.toLocaleString() : "—"}
          icon="ShoppingCart"
        />
        <StatsCard
          title="Active Merchants"
          value={stats ? stats.activeMerchants.toLocaleString() : "—"}
          icon="Store"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MiniChart title="Monthly Revenue" data={monthlyData} type="area" />
        <MiniChart title="User Growth" data={userGrowth} type="bar" />
      </div>
    </div>
  );
}
