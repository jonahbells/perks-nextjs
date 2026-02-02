"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Transaction = {
  _id: Id<"transactions">;
  customerName: string;
  merchantName: string;
  amount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  type: "earn" | "redeem" | "refund";
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: number;
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  pending: "outline",
  failed: "destructive",
  refunded: "secondary",
};

export default function TransactionsPage() {
  const transactions = useQuery(api.transactions.list, {});

  const columns: ColumnDef<Transaction>[] = [
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "merchantName", header: "Merchant" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
    },
    { accessorKey: "pointsEarned", header: "Points Earned" },
    { accessorKey: "pointsRedeemed", header: "Points Redeemed" },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status] ?? "outline"} className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View all transactions</p>
      </div>
      <DataTable columns={columns} data={transactions ?? []} searchKey="customerName" searchPlaceholder="Search by customer..." />
    </div>
  );
}
