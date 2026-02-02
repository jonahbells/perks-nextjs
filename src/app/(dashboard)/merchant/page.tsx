"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { MiniChart } from "@/components/dashboard/mini-chart";

const salesData = [
  { name: "Mon", value: 320 },
  { name: "Tue", value: 450 },
  { name: "Wed", value: 380 },
  { name: "Thu", value: 520 },
  { name: "Fri", value: 680 },
  { name: "Sat", value: 750 },
  { name: "Sun", value: 410 },
];

const customerVisits = [
  { name: "Jan", value: 890 },
  { name: "Feb", value: 1020 },
  { name: "Mar", value: 1150 },
  { name: "Apr", value: 980 },
  { name: "May", value: 1340 },
  { name: "Jun", value: 1480 },
];

export default function MerchantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Merchant Dashboard</h1>
        <p className="text-muted-foreground">Store performance and customer insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Today's Sales" value="$2,840" change="+12.3%" trend="up" icon="DollarSign" />
        <StatsCard title="Customers" value="1,284" change="+5.2%" trend="up" icon="Users" />
        <StatsCard title="Orders" value="342" change="-2.1%" trend="down" icon="ShoppingCart" />
        <StatsCard title="Active Stores" value="8" change="+1" trend="up" icon="Store" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MiniChart title="Weekly Sales" data={salesData} type="bar" />
        <MiniChart title="Customer Visits" data={customerVisits} type="area" />
      </div>
    </div>
  );
}
