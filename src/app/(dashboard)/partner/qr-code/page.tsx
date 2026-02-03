"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Download, QrCode, Copy, CheckCircle, Building2 } from "lucide-react";

export default function PartnerQRCodePage() {
  const partners = useQuery(api.partners.list);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentPartner = partners?.[0];
  const partnerCode = currentPartner?._id?.slice(-8).toUpperCase() ?? "PART001";
  const referralLink = `https://perks.app/partner/${partnerCode}`;

  useEffect(() => {
    if (!partnerCode) return;
    generateQR(partnerCode);
  }, [partnerCode]);

  function generateQR(code: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 280;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

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

    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = ((hash << 5) - hash + code.charCodeAt(i)) | 0;
    }

    const moduleSize = 8;
    for (let row = 10; row < 25; row++) {
      for (let col = 10; col < 25; col++) {
        if ((hash + row * col) % 3 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(code, size / 2, size - 12);

    setQrDataUrl(canvas.toDataURL("image/png"));
  }

  function handleDownload() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `partner-qr-${partnerCode}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Partner QR Code</h1>
        <p className="text-muted-foreground">Share your partner code for customer acquisition</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Partner QR Code</CardTitle>
            <CardDescription>Customers can scan to join through your partnership</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <canvas ref={canvasRef} className="hidden" />

            {qrDataUrl ? (
              <>
                <div className="rounded-2xl border-4 border-orange-500/20 bg-white p-6 shadow-lg">
                  <img src={qrDataUrl} alt="Partner QR Code" className="h-64 w-64" />
                </div>
                <div className="flex gap-2 w-full">
                  <Button onClick={handleDownload} className="flex-1 bg-orange-500 hover:bg-orange-600">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                    {copied ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    Copy Link
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex h-64 w-64 flex-col items-center justify-center rounded-xl border-2 border-dashed">
                <QrCode className="mb-2 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <Building2 className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">{currentPartner?.companyName ?? "Partner Company"}</p>
                  <p className="text-sm text-muted-foreground">{currentPartner?.partnerType ?? "Program Partner"}</p>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">Partner Code</p>
                <p className="text-2xl font-bold tracking-widest">{partnerCode}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={referralLink} readOnly className="text-sm" />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this link with customers to track acquisitions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Options</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Embed QR code on your website</li>
                <li>• Add to printed marketing materials</li>
                <li>• Include in email campaigns</li>
                <li>• Display at physical locations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
