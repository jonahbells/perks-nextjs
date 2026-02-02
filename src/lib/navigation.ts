import type { Role } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export const portalNav: Record<Role, { label: string; color: string; items: NavItem[] }> = {
  admin: {
    label: "Admin",
    color: "text-red-500",
    items: [
      { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
      { title: "Merchants", href: "/admin/merchants", icon: "Store" },
      { title: "Agents", href: "/admin/agents", icon: "UserCheck" },
      { title: "Ambassadors", href: "/admin/ambassadors", icon: "Award" },
      { title: "Partners", href: "/admin/partners", icon: "Handshake" },
      { title: "Customers", href: "/admin/customers", icon: "Users" },
      { title: "Transactions", href: "/admin/transactions", icon: "ArrowLeftRight" },
      { title: "Banner Ads", href: "/admin/banners", icon: "Image" },
      { title: "Settings", href: "/admin/settings", icon: "Settings" },
    ],
  },
  merchant: {
    label: "Merchant",
    color: "text-blue-500",
    items: [
      { title: "Dashboard", href: "/merchant", icon: "LayoutDashboard" },
      { title: "Stores", href: "/merchant/stores", icon: "Store" },
      { title: "Products", href: "/merchant/products", icon: "Package" },
      { title: "Transactions", href: "/merchant/transactions", icon: "ArrowLeftRight" },
      { title: "Customers", href: "/merchant/customers", icon: "Users" },
    ],
  },
  agent: {
    label: "Agent",
    color: "text-green-500",
    items: [
      { title: "Dashboard", href: "/agent", icon: "LayoutDashboard" },
      { title: "Referrals", href: "/agent/referrals", icon: "UserPlus" },
      { title: "Commissions", href: "/agent/commissions", icon: "Wallet" },
      { title: "Merchants", href: "/agent/merchants", icon: "Store" },
    ],
  },
  ambassador: {
    label: "Ambassador",
    color: "text-purple-500",
    items: [
      { title: "Dashboard", href: "/ambassador", icon: "LayoutDashboard" },
      { title: "Referrals", href: "/ambassador/referrals", icon: "UserPlus" },
      { title: "Earnings", href: "/ambassador/earnings", icon: "Wallet" },
      { title: "Leaderboard", href: "/ambassador/leaderboard", icon: "Trophy" },
    ],
  },
  partner: {
    label: "Partner",
    color: "text-orange-500",
    items: [
      { title: "Dashboard", href: "/partner", icon: "LayoutDashboard" },
      { title: "Revenue", href: "/partner/revenue", icon: "TrendingUp" },
      { title: "Reports", href: "/partner/reports", icon: "FileText" },
      { title: "Integration", href: "/partner/integration", icon: "Plug" },
    ],
  },
};
