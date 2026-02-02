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

type Partner = {
  _id: Id<"partners">;
  userName: string;
  companyName: string;
  partnerType: string;
  revenueShare: number;
  isActive: boolean;
};

export default function PartnersPage() {
  const partners = useQuery(api.partners.list);
  const createPartner = useMutation(api.partners.create);
  const toggleActive = useMutation(api.partners.toggleActive);
  const [open, setOpen] = useState(false);

  const columns: ColumnDef<Partner>[] = [
    { accessorKey: "companyName", header: "Company Name" },
    { accessorKey: "userName", header: "Contact" },
    { accessorKey: "partnerType", header: "Type" },
    {
      accessorKey: "revenueShare",
      header: "Revenue Share",
      cell: ({ row }) => `${row.original.revenueShare}%`,
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
    await createPartner({
      userName: form.get("userName") as string,
      email: form.get("email") as string,
      companyName: form.get("companyName") as string,
      partnerType: form.get("partnerType") as string,
      revenueShare: parseFloat(form.get("revenueShare") as string),
    });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
          <p className="text-muted-foreground">Manage partner accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Partner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Contact Name</Label>
                <Input id="userName" name="userName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerType">Partner Type</Label>
                <Input id="partnerType" name="partnerType" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenueShare">Revenue Share (%)</Label>
                <Input id="revenueShare" name="revenueShare" type="number" step="0.1" required />
              </div>
              <Button type="submit" className="w-full">Create Partner</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={partners ?? []} searchKey="companyName" searchPlaceholder="Search partners..." />
    </div>
  );
}
