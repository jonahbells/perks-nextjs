"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { MiniChart } from "@/components/dashboard/mini-chart";

const revenueData = [
  { name: "Jan", value: 8400 },
  { name: "Feb", value: 9200 },
  { name: "Mar", value: 8800 },
  { name: "Apr", value: 11500 },
  { name: "May", value: 12800 },
  { name: "Jun", value: 14200 },
];

const integrationsData = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 3100 },
  { name: "Mar", value: 2800 },
  { name: "Apr", value: 3600 },
  { name: "May", value: 4200 },
  { name: "Jun", value: 4800 },
];

export default function PartnerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Partner Dashboard</h1>
        <p className="text-muted-foreground">Revenue share and integration metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Revenue Share" value="$64,900" change="+11.3%" trend="up" icon="DollarSign" />
        <StatsCard title="API Calls" value="1.2M" change="+28.4%" trend="up" icon="TrendingUp" />
        <StatsCard title="Active Integrations" value="12" change="+2" trend="up" icon="Store" />
        <StatsCard title="This Month" value="$14,200" change="+10.9%" trend="up" icon="DollarSign" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MiniChart title="Monthly Revenue" data={revenueData} type="area" />
        <MiniChart title="Integration Traffic" data={integrationsData} type="bar" />
      </div>
    </div>
  );
}
