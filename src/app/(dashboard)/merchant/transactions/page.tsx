"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, ArrowDownRight, RefreshCw, DollarSign, TrendingUp } from "lucide-react";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Transaction = {
  _id: Id<"transactions">;
  customerName: string;
  storeName: string;
  amount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  type: "earn" | "redeem" | "refund";
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: number;
};

export default function TransactionsPage() {
  const transactions = useQuery(api.transactions.list);

  // Calculate summary stats
  const stats = transactions?.reduce(
    (acc, t) => {
      if (t.status === "completed") {
        acc.totalAmount += t.amount;
        acc.totalPointsEarned += t.pointsEarned;
        acc.totalPointsRedeemed += t.pointsRedeemed;
      }
      return acc;
    },
    { totalAmount: 0, totalPointsEarned: 0, totalPointsRedeemed: 0 }
  ) ?? { totalAmount: 0, totalPointsEarned: 0, totalPointsRedeemed: 0 };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "storeName", header: "Store" },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        const icons = {
          earn: <ArrowUpRight className="h-4 w-4 text-green-500" />,
          redeem: <ArrowDownRight className="h-4 w-4 text-blue-500" />,
          refund: <RefreshCw className="h-4 w-4 text-orange-500" />,
        };
        return (
          <div className="flex items-center gap-2">
            {icons[type]}
            <span className="capitalize">{type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium">${row.original.amount.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "pointsEarned",
      header: "Points",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.pointsEarned > 0 && (
            <span className="text-green-600">+{row.original.pointsEarned}</span>
          )}
          {row.original.pointsRedeemed > 0 && (
            <span className="text-blue-600">-{row.original.pointsRedeemed}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          completed: "default",
          pending: "outline",
          failed: "destructive",
          refunded: "secondary",
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View your transaction history</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPointsEarned.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPointsRedeemed.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={transactions ?? []}
        searchKey="customerName"
        searchPlaceholder="Search by customer..."
      />
    </div>
  );
}
