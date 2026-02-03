"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";

export default function PartnerPointsPage() {
  const partners = useQuery(api.partners.list);
  const transactions = useQuery(api.transactions.list);

  const currentPartner = partners?.[0];

  // Calculate stats
  const completedTransactions = transactions?.filter((t) => t.status === "completed") ?? [];
  const totalVolume = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const revenueShare = currentPartner?.revenueShare ?? 10;
  const estimatedEarnings = totalVolume * (revenueShare / 100);

  // Simulated points/revenue history
  const revenueHistory = [
    { id: 1, description: "Q4 2025 Revenue Share", amount: 2500, date: Date.now() - 86400000 * 30 },
    { id: 2, description: "Q3 2025 Revenue Share", amount: 2100, date: Date.now() - 86400000 * 120 },
    { id: 3, description: "Q2 2025 Revenue Share", amount: 1800, date: Date.now() - 86400000 * 210 },
    { id: 4, description: "Q1 2025 Revenue Share", amount: 1500, date: Date.now() - 86400000 * 300 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue & Points</h1>
        <p className="text-muted-foreground">Track your partnership earnings</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${estimatedEarnings.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
            <Percent className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueShare}%</div>
            <p className="text-sm text-muted-foreground">of transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">total volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTransactions.length}</div>
            <p className="text-sm text-muted-foreground">completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
            <CardDescription>Your quarterly revenue share payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                      <ArrowUpRight className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">+${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Benefits</CardTitle>
            <CardDescription>Your current partnership tier benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Revenue Share</h4>
                <Badge className="bg-orange-500">{revenueShare}%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn {revenueShare}% of all transactions from referred customers
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Priority Support</h4>
                <Badge variant="outline">Included</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Dedicated account manager and 24/7 support access
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">API Access</h4>
                <Badge variant="outline">Included</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Full API access for custom integrations
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Quarterly Reports</h4>
                <Badge variant="outline">Included</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Detailed analytics and performance reports
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
