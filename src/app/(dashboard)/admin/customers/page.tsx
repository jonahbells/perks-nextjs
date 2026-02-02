"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Customer = {
  _id: Id<"customers">;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  points: number;
  tier: string;
  isActive: boolean;
};

export default function CustomersPage() {
  const customers = useQuery(api.customers.list, {});

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "points", header: "Points" },
    { accessorKey: "tier", header: "Tier" },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">View customer accounts</p>
      </div>
      <DataTable columns={columns} data={customers ?? []} searchKey="firstName" searchPlaceholder="Search customers..." />
    </div>
  );
}
