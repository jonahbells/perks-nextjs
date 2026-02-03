"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

type CommissionEntry = {
  id: string;
  customerName: string;
  transactionAmount: number;
  commissionRate: number;
  commissionEarned: number;
  status: "pending" | "paid";
  date: number;
};

export default function CommissionsPage() {
  const agents = useQuery(api.agents.list);
  const transactions = useQuery(api.transactions.list);

  // Get current agent
  const currentAgent = agents?.[0];
  const commissionRate = currentAgent?.commissionRate ?? 5;

  // Calculate commissions from transactions (simulated)
  const commissions: CommissionEntry[] = (transactions ?? []).slice(0, 10).map((t, i) => ({
    id: `comm-${i}`,
    customerName: t.customerName,
    transactionAmount: t.amount,
    commissionRate: commissionRate,
    commissionEarned: t.amount * (commissionRate / 100),
    status: t.status === "completed" ? "paid" : "pending",
    date: t.createdAt,
  }));

  // Stats
  const totalEarned = commissions.reduce((sum, c) => sum + (c.status === "paid" ? c.commissionEarned : 0), 0);
  const pendingAmount = commissions.reduce((sum, c) => sum + (c.status === "pending" ? c.commissionEarned : 0), 0);
  const paidCount = commissions.filter((c) => c.status === "paid").length;

  const columns: ColumnDef<CommissionEntry>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    { accessorKey: "customerName", header: "Customer" },
    {
      accessorKey: "transactionAmount",
      header: "Transaction",
      cell: ({ row }) => `$${row.original.transactionAmount.toFixed(2)}`,
    },
    {
      accessorKey: "commissionRate",
      header: "Rate",
      cell: ({ row }) => `${row.original.commissionRate}%`,
    },
    {
      accessorKey: "commissionEarned",
      header: "Commission",
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          +${row.original.commissionEarned.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "paid" ? "default" : "outline"}>
          {row.original.status === "paid" ? "Paid" : "Pending"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commissions</h1>
        <p className="text-muted-foreground">Track your earnings from referrals</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentAgent?.totalEarnings?.toFixed(2) ?? "0.00"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={commissions}
            searchKey="customerName"
            searchPlaceholder="Search by customer..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
