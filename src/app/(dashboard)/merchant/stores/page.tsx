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
import { MoreHorizontal, Plus, MapPin } from "lucide-react";
import { useState } from "react";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Store = {
  _id: Id<"stores">;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: number;
};

export default function StoresPage() {
  const stores = useQuery(api.stores.list);
  const createStore = useMutation(api.stores.create);
  const toggleActive = useMutation(api.stores.toggleActive);
  const removeStore = useMutation(api.stores.remove);
  const [open, setOpen] = useState(false);

  // TODO: Get merchantId from authenticated user context
  // For now we'll use a placeholder - this should come from the logged-in merchant
  const merchants = useQuery(api.merchants.list);
  const currentMerchantId = merchants?.[0]?._id;

  const columns: ColumnDef<Store>[] = [
    { accessorKey: "name", header: "Store Name" },
    { accessorKey: "address", header: "Address" },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) =>
        row.original.latitude && row.original.longitude ? (
          <a
            href={`https://maps.google.com/?q=${row.original.latitude},${row.original.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:underline"
          >
            <MapPin className="mr-1 h-4 w-4" />
            View Map
          </a>
        ) : (
          <span className="text-muted-foreground">Not set</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
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
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => removeStore({ id: row.original._id })}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentMerchantId) {
      alert("No merchant found. Please set up your merchant profile first.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const lat = form.get("latitude") as string;
    const lng = form.get("longitude") as string;
    await createStore({
      merchantId: currentMerchantId,
      name: form.get("name") as string,
      address: form.get("address") as string,
      latitude: lat ? parseFloat(lat) : undefined,
      longitude: lng ? parseFloat(lng) : undefined,
    });
    setOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">Manage your store locations</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Store</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input id="name" name="name" placeholder="Main Branch" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="123 Main St, City" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude (optional)</Label>
                  <Input id="latitude" name="latitude" type="number" step="any" placeholder="14.5995" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude (optional)</Label>
                  <Input id="longitude" name="longitude" type="number" step="any" placeholder="120.9842" />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Store</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={stores ?? []} searchKey="name" searchPlaceholder="Search stores..." />
    </div>
  );
}
