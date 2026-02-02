"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { MiniChart } from "@/components/dashboard/mini-chart";

const commissionsData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1450 },
  { name: "Mar", value: 1100 },
  { name: "Apr", value: 1800 },
  { name: "May", value: 2100 },
  { name: "Jun", value: 1950 },
];

const referralsData = [
  { name: "Jan", value: 8 },
  { name: "Feb", value: 12 },
  { name: "Mar", value: 6 },
  { name: "Apr", value: 15 },
  { name: "May", value: 18 },
  { name: "Jun", value: 14 },
];

export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Dashboard</h1>
        <p className="text-muted-foreground">Referrals and commission tracking</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Commissions" value="$9,600" change="+18.4%" trend="up" icon="DollarSign" />
        <StatsCard title="Active Referrals" value="73" change="+6" trend="up" icon="Users" />
        <StatsCard title="This Month" value="$1,950" change="-7.1%" trend="down" icon="TrendingDown" />
        <StatsCard title="Merchants Signed" value="24" change="+3" trend="up" icon="Store" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MiniChart title="Monthly Commissions" data={commissionsData} type="area" />
        <MiniChart title="Referrals per Month" data={referralsData} type="bar" />
      </div>
    </div>
  );
}
