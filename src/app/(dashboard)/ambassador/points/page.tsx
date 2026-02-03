"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, TrendingUp, Gift, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AmbassadorPointsPage() {
  const ambassadors = useQuery(api.ambassadors.list);
  const transactions = useQuery(api.transactions.list);

  const currentAmbassador = ambassadors?.[0];
  const totalPoints = currentAmbassador?.totalEarnings ?? 0;

  // Simulated points history
  const pointsHistory = [
    { id: 1, type: "earn", description: "Referral Bonus - John Doe", points: 50, date: Date.now() - 86400000 },
    { id: 2, type: "earn", description: "Referral Bonus - Jane Smith", points: 50, date: Date.now() - 172800000 },
    { id: 3, type: "redeem", description: "Gift Card Redemption", points: -100, date: Date.now() - 259200000 },
    { id: 4, type: "earn", description: "Tier Bonus - Silver", points: 200, date: Date.now() - 345600000 },
    { id: 5, type: "earn", description: "Referral Bonus - Bob Wilson", points: 50, date: Date.now() - 432000000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Points</h1>
        <p className="text-muted-foreground">Track your earned points and redemptions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Points</CardTitle>
            <Star className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPoints.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">points available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalPoints + 100).toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">lifetime points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed</CardTitle>
            <Gift className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-sm text-muted-foreground">points used</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
            <CardDescription>Your recent points activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pointsHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      item.type === "earn" ? "bg-green-500/10" : "bg-blue-500/10"
                    }`}>
                      {item.type === "earn" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${item.points > 0 ? "text-green-600" : "text-blue-600"}`}>
                    {item.points > 0 ? "+" : ""}{item.points}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
            <CardDescription>Ways to increase your points balance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Referral Bonus</h4>
                <Badge variant="outline">50-150 pts</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn points for every new customer who joins using your referral code
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Tier Milestone</h4>
                <Badge variant="outline">100-500 pts</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Bonus points when you reach a new tier level
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Monthly Challenge</h4>
                <Badge variant="outline">250 pts</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete monthly referral challenges for extra points
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
