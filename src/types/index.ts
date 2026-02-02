export type Role = "admin" | "merchant" | "agent" | "ambassador" | "partner";

export interface User {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdAt?: number;
}

export interface Merchant {
  _id: string;
  userId: string;
  businessName: string;
  businessType: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  isActive: boolean;
  createdAt: number;
}

export interface Store {
  _id: string;
  merchantId: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: number;
}

export interface Agent {
  _id: string;
  userId: string;
  referralCode: string;
  commissionRate: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt: number;
}

export interface Ambassador {
  _id: string;
  userId: string;
  referralCode: string;
  tier: string;
  totalReferrals: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt: number;
}

export interface Partner {
  _id: string;
  userId: string;
  companyName: string;
  partnerType: string;
  revenueShare: number;
  isActive: boolean;
  createdAt: number;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  points: number;
  tier: string;
  referredBy?: string;
  isActive: boolean;
  createdAt: number;
}

export interface Transaction {
  _id: string;
  customerId: string;
  storeId: string;
  merchantId: string;
  amount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  type: "earn" | "redeem" | "refund";
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: number;
}

export interface Product {
  _id: string;
  merchantId: string;
  storeId: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: number;
}

export interface BannerAd {
  _id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: "home" | "merchant" | "rewards";
  startDate: number;
  endDate: number;
  isActive: boolean;
  createdAt: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface PortalConfig {
  role: Role;
  label: string;
  navItems: NavItem[];
  color: string;
}
