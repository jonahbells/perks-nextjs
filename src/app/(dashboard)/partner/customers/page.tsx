"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ColumnDef } from "@tanstack/react-table";
import { Users, UserCheck, Star, TrendingUp } from "lucide-react";
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
  createdAt: number;
};

export default function PartnerCustomersPage() {
  const customers = useQuery(api.customers.list, {});
  const partners = useQuery(api.partners.list);

  const currentPartner = partners?.[0];
  const totalCustomers = customers?.length ?? 0;
  const activeCustomers = customers?.filter((c) => c.isActive).length ?? 0;
  const totalPoints = customers?.reduce((sum, c) => sum + c.points, 0) ?? 0;

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "firstName",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.points.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "tier",
      header: "Tier",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.tier}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
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
        <h1 className="text-2xl font-bold tracking-tight">Partner Customers</h1>
        <p className="text-muted-foreground">Customers acquired through your partnership</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Generated</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPartner?.revenueShare ?? 0}%</div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={customers ?? []}
        searchKey="firstName"
        searchPlaceholder="Search customers..."
      />
    </div>
  );
}
