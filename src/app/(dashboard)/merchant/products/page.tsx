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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Package } from "lucide-react";
import { useState } from "react";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Product = {
  _id: Id<"products">;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  storeName: string;
  isActive: boolean;
  createdAt: number;
};

export default function ProductsPage() {
  const products = useQuery(api.products.list);
  const createProduct = useMutation(api.products.create);
  const toggleActive = useMutation(api.products.toggleActive);
  const removeProduct = useMutation(api.products.remove);
  const [open, setOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");

  // Get merchants and stores for the form
  const merchants = useQuery(api.merchants.list);
  const stores = useQuery(api.stores.list);
  const currentMerchantId = merchants?.[0]?._id;

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.imageUrl ? (
            <img
              src={row.original.imageUrl}
              alt={row.original.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "storeName", header: "Store" },
    {
      accessorKey: "pointsCost",
      header: "Points Cost",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.pointsCost.toLocaleString()} pts</span>
      ),
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
              onClick={() => removeProduct({ id: row.original._id })}
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
    if (!currentMerchantId || !selectedStore) {
      alert("Please select a store.");
      return;
    }
    const form = new FormData(e.currentTarget);
    await createProduct({
      merchantId: currentMerchantId,
      storeId: selectedStore as Id<"stores">,
      name: form.get("name") as string,
      description: form.get("description") as string,
      pointsCost: parseInt(form.get("pointsCost") as string),
      category: form.get("category") as string,
      imageUrl: (form.get("imageUrl") as string) || undefined,
    });
    setOpen(false);
    setSelectedStore("");
    e.currentTarget.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store">Store</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores?.map((store) => (
                      <SelectItem key={store._id} value={store._id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="Free Coffee" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Redeem for a free regular-sized coffee"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pointsCost">Points Cost</Label>
                  <Input id="pointsCost" name="pointsCost" type="number" min="1" placeholder="100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="Beverages" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
              </div>
              <Button type="submit" className="w-full">Create Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={products ?? []} searchKey="name" searchPlaceholder="Search products..." />
    </div>
  );
}
