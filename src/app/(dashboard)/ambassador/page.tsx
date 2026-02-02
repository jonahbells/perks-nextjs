"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { MiniChart } from "@/components/dashboard/mini-chart";

const earningsData = [
  { name: "Jan", value: 450 },
  { name: "Feb", value: 620 },
  { name: "Mar", value: 580 },
  { name: "Apr", value: 790 },
  { name: "May", value: 920 },
  { name: "Jun", value: 1050 },
];

const referralData = [
  { name: "Jan", value: 22 },
  { name: "Feb", value: 31 },
  { name: "Mar", value: 28 },
  { name: "Apr", value: 42 },
  { name: "May", value: 55 },
  { name: "Jun", value: 48 },
];

export default function AmbassadorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ambassador Dashboard</h1>
        <p className="text-muted-foreground">Your referral performance and earnings</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Earnings" value="$4,410" change="+24.1%" trend="up" icon="DollarSign" />
        <StatsCard title="Total Referrals" value="226" change="+48" trend="up" icon="Users" />
        <StatsCard title="This Month" value="$1,050" change="+14.1%" trend="up" icon="TrendingUp" />
        <StatsCard title="Current Tier" value="Gold" icon="TrendingUp" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MiniChart title="Monthly Earnings" data={earningsData} type="area" />
        <MiniChart title="Referrals per Month" data={referralData} type="bar" />
      </div>
    </div>
  );
}
