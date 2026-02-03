"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Copy, Share2, Users, TrendingUp, Award, CheckCircle } from "lucide-react";

export default function ReferralsPage() {
  const agents = useQuery(api.agents.list);
  const customers = useQuery(api.customers.list, {});
  const [copied, setCopied] = useState(false);

  // Get current agent's referral code (first agent for demo)
  const currentAgent = agents?.[0];
  const referralCode = currentAgent?.referralCode ?? "AGENT001";
  const referralLink = `https://perks.app/join?ref=${referralCode}`;

  // Stats
  const totalReferrals = customers?.length ?? 0;
  const thisMonthReferrals = customers?.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length ?? 0;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Referrals</h1>
        <p className="text-muted-foreground">Track and share your referral code</p>
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
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentAgent?.commissionRate ?? 5}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentAgent?.totalEarnings?.toFixed(2) ?? "0.00"}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>Share this code with potential customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-muted/50 px-4 py-3">
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

            <Button className="w-full" onClick={() => copyToClipboard(referralLink)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Referral Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
            <CardDescription>Your latest customer sign-ups</CardDescription>
          </CardHeader>
          <CardContent>
            {customers && customers.length > 0 ? (
              <div className="space-y-4">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={customer.isActive ? "default" : "secondary"}>
                      {customer.isActive ? "Active" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                <p>No referrals yet. Start sharing your code!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
