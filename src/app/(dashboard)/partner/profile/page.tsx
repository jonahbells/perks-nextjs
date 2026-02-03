"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, User, Percent, Calendar, CheckCircle, Globe, Mail } from "lucide-react";

export default function PartnerProfilePage() {
  const partners = useQuery(api.partners.list);
  const partner = partners?.[0];

  if (!partner) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No partner profile found</h2>
          <p className="text-muted-foreground">Please contact support to set up your partner account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Partner Profile</h1>
        <p className="text-muted-foreground">Your partnership account details</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Your partnership details with Perks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xl font-bold">{partner.companyName}</p>
                <Badge className="mt-1 bg-orange-500">{partner.partnerType}</Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{partner.userName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Share</p>
                  <p className="text-2xl font-bold text-orange-500">{partner.revenueShare}%</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-3">Partnership Agreement</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Type</span>
                  <span className="font-medium">Revenue Share</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Terms</span>
                  <span className="font-medium">Net 30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renewal</span>
                  <span className="font-medium">Annual</span>
                </div>
              </div>
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
                <span className="text-sm">Partnership Status</span>
                <Badge variant={partner.isActive ? "default" : "secondary"}>
                  {partner.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verified Partner</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Access</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Partner since {new Date(partner.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Partner Type</span>
                <span className="font-medium">{partner.partnerType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revenue Share</span>
                <span className="font-medium">{partner.revenueShare}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>partners@perks.app</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>partners.perks.app</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
