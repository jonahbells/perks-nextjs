"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Copy, Share2, Users, TrendingUp, Award, Star, CheckCircle } from "lucide-react";

export default function AmbassadorReferralsPage() {
  const ambassadors = useQuery(api.ambassadors.list);
  const customers = useQuery(api.customers.list, {});
  const [copied, setCopied] = useState(false);

  const currentAmbassador = ambassadors?.[0];
  const referralCode = currentAmbassador?.referralCode ?? "AMB001";
  const referralLink = `https://perks.app/join?ambassador=${referralCode}`;

  // Tier progress
  const tierGoals: Record<string, number> = { Bronze: 10, Silver: 25, Gold: 50, Platinum: 100 };
  const currentTier = currentAmbassador?.tier ?? "Bronze";
  const totalReferrals = currentAmbassador?.totalReferrals ?? 0;
  const nextTierGoal = tierGoals[currentTier] ?? 10;
  const progress = Math.min((totalReferrals / nextTierGoal) * 100, 100);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Referral Program</h1>
        <p className="text-muted-foreground">Share and earn rewards for every referral</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTier}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentAmbassador?.totalEarnings?.toLocaleString() ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers?.length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>Share this code to earn rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-3">
                <p className="text-2xl font-bold tracking-wider text-center">{referralCode}</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(referralCode)}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Referral Link</p>
              <div className="flex items-center gap-2">
                <Input value={referralLink} readOnly className="text-sm" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(referralLink)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={() => copyToClipboard(referralLink)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Referral Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tier Progress</CardTitle>
            <CardDescription>Reach the next tier to unlock more rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentTier}</span>
                <span>{totalReferrals} / {nextTierGoal} referrals</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Object.entries(tierGoals).map(([tier, goal]) => (
                <div
                  key={tier}
                  className={`rounded-lg border p-3 text-center ${
                    currentTier === tier ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <p className="text-xs text-muted-foreground">{tier}</p>
                  <p className="font-bold">{goal}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Tier Benefits</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Bronze: 50 points per referral</li>
                <li>• Silver: 75 points per referral + bonus</li>
                <li>• Gold: 100 points per referral + exclusive perks</li>
                <li>• Platinum: 150 points per referral + VIP access</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
