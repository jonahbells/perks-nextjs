"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Header } from "@/components/dashboard/header";
import { portalNav } from "@/lib/navigation";
import type { Role } from "@/types";

function detectPortal(pathname: string): Role {
  if (pathname.startsWith("/merchant")) return "merchant";
  if (pathname.startsWith("/agent")) return "agent";
  if (pathname.startsWith("/ambassador")) return "ambassador";
  if (pathname.startsWith("/partner")) return "partner";
  return "admin";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = detectPortal(pathname);
  const portal = portalNav[role];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header portalLabel={portal.label} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
