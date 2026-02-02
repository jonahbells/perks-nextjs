"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Ambassador = {
  _id: Id<"ambassadors">;
  userName: string;
  referralCode: string;
  tier: string;
  totalReferrals: number;
  totalEarnings: number;
  isActive: boolean;
};

export default function AmbassadorsPage() {
  const ambassadors = useQuery(api.ambassadors.list);
  const createAmbassador = useMutation(api.ambassadors.create);
  const toggleActive = useMutation(api.ambassadors.toggleActive);
  const [open, setOpen] = useState(false);

  const columns: ColumnDef<Ambassador>[] = [
    { accessorKey: "userName", header: "Name" },
    { accessorKey: "referralCode", header: "Referral Code" },
    { accessorKey: "tier", header: "Tier" },
    { accessorKey: "totalReferrals", header: "Referrals" },
    {
      accessorKey: "totalEarnings",
      header: "Earnings",
      cell: ({ row }) => `$${row.original.totalEarnings.toFixed(2)}`,
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
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleActive({ id: row.original._id })}>
              {row.original.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createAmbassador({
      userName: form.get("userName") as string,
      email: form.get("email") as string,
      referralCode: form.get("referralCode") as string,
      tier: form.get("tier") as string,
    });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ambassadors</h1>
          <p className="text-muted-foreground">Manage ambassador accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Ambassador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Ambassador</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input id="userName" name="userName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code</Label>
                <Input id="referralCode" name="referralCode" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Input id="tier" name="tier" placeholder="e.g. Bronze, Silver, Gold" required />
              </div>
              <Button type="submit" className="w-full">Create Ambassador</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={ambassadors ?? []} searchKey="userName" searchPlaceholder="Search ambassadors..." />
    </div>
  );
}
