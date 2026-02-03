"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { User, Hash, Award, Star, Users, Calendar, CheckCircle } from "lucide-react";

export default function AmbassadorProfilePage() {
  const ambassadors = useQuery(api.ambassadors.list);
  const ambassador = ambassadors?.[0];

  // Tier progress
  const tierGoals: Record<string, number> = { Bronze: 10, Silver: 25, Gold: 50, Platinum: 100 };
  const currentTier = ambassador?.tier ?? "Bronze";
  const totalReferrals = ambassador?.totalReferrals ?? 0;
  const nextTierGoal = tierGoals[currentTier] ?? 10;
  const progress = Math.min((totalReferrals / nextTierGoal) * 100, 100);

  if (!ambassador) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No ambassador profile found</h2>
          <p className="text-muted-foreground">Please contact support to set up your ambassador account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ambassador Profile</h1>
        <p className="text-muted-foreground">Your ambassador account details</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your ambassador program details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xl font-bold">{ambassador.userName}</p>
                <Badge className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  {ambassador.tier} Ambassador
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Referral Code</p>
                  <p className="font-mono text-lg font-bold">{ambassador.referralCode}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <p className="font-medium">{ambassador.tier}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="font-medium">{ambassador.totalReferrals}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <p className="font-medium">{ambassador.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to next tier</span>
                <span>{totalReferrals} / {nextTierGoal} referrals</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant={ambassador.isActive ? "default" : "secondary"}>
                  {ambassador.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verified</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(ambassador.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tier Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Points per referral</span>
                  <span className="font-medium">
                    {currentTier === "Platinum" ? 150 : currentTier === "Gold" ? 100 : currentTier === "Silver" ? 75 : 50}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Exclusive perks</span>
                  <span className="font-medium">{currentTier === "Gold" || currentTier === "Platinum" ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">VIP access</span>
                  <span className="font-medium">{currentTier === "Platinum" ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
