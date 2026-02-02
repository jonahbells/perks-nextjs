"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Store,
  ArrowLeftRight,
  Image,
  Settings,
  Package,
  UserPlus,
  Wallet,
  Trophy,
  TrendingUp,
  FileText,
  Plug,
  UserCheck,
  Award,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { portalNav } from "@/lib/navigation";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Store,
  ArrowLeftRight,
  Image,
  Settings,
  Package,
  UserPlus,
  Wallet,
  Trophy,
  TrendingUp,
  FileText,
  Plug,
  UserCheck,
  Award,
  Handshake,
};

function detectPortal(pathname: string): Role {
  if (pathname.startsWith("/merchant")) return "merchant";
  if (pathname.startsWith("/agent")) return "agent";
  if (pathname.startsWith("/ambassador")) return "ambassador";
  if (pathname.startsWith("/partner")) return "partner";
  return "admin";
}

export function AppSidebar() {
  const pathname = usePathname();
  const role = detectPortal(pathname);
  const portal = portalNav[role];

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href={`/${role}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm">
            P
          </div>
          <span className="text-lg font-bold tracking-tight">Perks</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn("uppercase text-xs", portal.color)}>
            {portal.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portal.items.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutDashboard;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-muted-foreground">Perks Backoffice v2.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}
