"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { Download, QrCode, Store } from "lucide-react";

export default function QRCodePage() {
  const stores = useQuery(api.stores.list);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code when store is selected
  useEffect(() => {
    if (!selectedStore) {
      setQrDataUrl("");
      return;
    }

    // Create QR code data - this would typically be a URL to your app
    const qrData = JSON.stringify({
      type: "store",
      storeId: selectedStore,
      action: "earn_points",
    });

    // Simple QR code generation using canvas
    // In production, you'd use a library like qrcode.react
    generateSimpleQR(qrData);
  }, [selectedStore]);

  function generateSimpleQR(data: string) {
    // This is a placeholder - in production use a proper QR library
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // Draw a placeholder QR-like pattern
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    // Draw corner squares (QR code positioning patterns)
    const drawPositionSquare = (x: number, y: number, s: number) => {
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + s * 0.14, y + s * 0.14, s * 0.72, s * 0.72);
      ctx.fillStyle = "#000000";
      ctx.fillRect(x + s * 0.28, y + s * 0.28, s * 0.44, s * 0.44);
    };

    const patternSize = 56;
    drawPositionSquare(16, 16, patternSize);
    drawPositionSquare(size - patternSize - 16, 16, patternSize);
    drawPositionSquare(16, size - patternSize - 16, patternSize);

    // Draw some random-looking modules based on data hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
    }

    const moduleSize = 8;
    for (let row = 10; row < 22; row++) {
      for (let col = 10; col < 22; col++) {
        if ((hash + row * col) % 3 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add store ID text
    ctx.font = "10px sans-serif";
    ctx.fillText(selectedStore.slice(-8), size / 2 - 30, size - 8);

    setQrDataUrl(canvas.toDataURL("image/png"));
  }

  function handleDownload() {
    if (!qrDataUrl || !selectedStore) return;
    const store = stores?.find((s) => s._id === selectedStore);
    const link = document.createElement("a");
    link.download = `qr-${store?.name?.replace(/\s+/g, "-").toLowerCase() ?? "store"}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  const selectedStoreData = stores?.find((s) => s._id === selectedStore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">QR Code</h1>
        <p className="text-muted-foreground">Generate QR codes for customer point collection</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Store</CardTitle>
            <CardDescription>Choose which store to generate a QR code for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Location</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores?.map((store) => (
                    <SelectItem key={store._id} value={store._id}>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        {store.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStoreData && (
              <div className="rounded-lg border p-4 space-y-2">
                <p className="font-medium">{selectedStoreData.name}</p>
                <p className="text-sm text-muted-foreground">{selectedStoreData.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
            <CardDescription>
              Customers scan this code to earn points at your store
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <canvas ref={canvasRef} className="hidden" />

            {qrDataUrl ? (
              <>
                <div className="rounded-xl border-4 border-primary/10 bg-white p-4">
                  <img src={qrDataUrl} alt="Store QR Code" className="h-64 w-64" />
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </>
            ) : (
              <div className="flex h-64 w-64 flex-col items-center justify-center rounded-xl border-2 border-dashed text-center">
                <QrCode className="mb-2 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Select a store to generate QR code
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                1
              </div>
              <h3 className="font-medium">Display QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Print and display the QR code at your store counter
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                2
              </div>
              <h3 className="font-medium">Customer Scans</h3>
              <p className="text-sm text-muted-foreground">
                Customers scan the code with their Perks app after purchase
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                3
              </div>
              <h3 className="font-medium">Points Awarded</h3>
              <p className="text-sm text-muted-foreground">
                Points are automatically added to the customer&apos;s account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
