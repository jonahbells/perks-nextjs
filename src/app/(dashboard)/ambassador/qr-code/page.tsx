"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Download, QrCode, Share2, Copy, CheckCircle } from "lucide-react";

export default function AmbassadorQRCodePage() {
  const ambassadors = useQuery(api.ambassadors.list);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentAmbassador = ambassadors?.[0];
  const referralCode = currentAmbassador?.referralCode ?? "AMB001";
  const referralLink = `https://perks.app/join?ambassador=${referralCode}`;

  useEffect(() => {
    if (!referralCode) return;
    generateQR(referralCode);
  }, [referralCode]);

  function generateQR(code: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 280;
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    // QR positioning patterns
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

    // Data modules
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

    // Add code text
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(code, size / 2, size - 12);

    setQrDataUrl(canvas.toDataURL("image/png"));
  }

  function handleDownload() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `ambassador-qr-${referralCode}.png`;
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
        <h1 className="text-2xl font-bold tracking-tight">My QR Code</h1>
        <p className="text-muted-foreground">Share your personal QR code to get referrals</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Personal QR Code</CardTitle>
            <CardDescription>People can scan this to join using your referral</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <canvas ref={canvasRef} className="hidden" />

            {qrDataUrl ? (
              <>
                <div className="rounded-2xl border-4 border-purple-500/20 bg-white p-6 shadow-lg">
                  <img src={qrDataUrl} alt="Ambassador QR Code" className="h-64 w-64" />
                </div>
                <div className="flex gap-2 w-full">
                  <Button onClick={handleDownload} className="flex-1">
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
              <CardTitle>Referral Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 text-center">
                <p className="text-3xl font-bold tracking-widest">{referralCode}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Referral Link
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download QR Image
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Share to Social Media
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Print your QR code and share at events</li>
                <li>• Add it to your social media profiles</li>
                <li>• Share the link in messaging apps</li>
                <li>• Include it in your email signature</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
