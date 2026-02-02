import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(
      v.union(
        v.literal("admin"),
        v.literal("merchant"),
        v.literal("agent"),
        v.literal("ambassador"),
        v.literal("partner")
      )
    ),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  merchants: defineTable({
    userId: v.id("users"),
    businessName: v.string(),
    businessType: v.string(),
    contactEmail: v.string(),
    contactPhone: v.string(),
    address: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  stores: defineTable({
    merchantId: v.id("merchants"),
    name: v.string(),
    address: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_merchantId", ["merchantId"]),

  agents: defineTable({
    userId: v.id("users"),
    referralCode: v.string(),
    commissionRate: v.number(),
    totalEarnings: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_referralCode", ["referralCode"]),

  ambassadors: defineTable({
    userId: v.id("users"),
    referralCode: v.string(),
    tier: v.string(),
    totalReferrals: v.number(),
    totalEarnings: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_referralCode", ["referralCode"]),

  partners: defineTable({
    userId: v.id("users"),
    companyName: v.string(),
    partnerType: v.string(),
    revenueShare: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  customers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    points: v.number(),
    tier: v.string(),
    referredBy: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  transactions: defineTable({
    customerId: v.id("customers"),
    storeId: v.id("stores"),
    merchantId: v.id("merchants"),
    amount: v.number(),
    pointsEarned: v.number(),
    pointsRedeemed: v.number(),
    type: v.union(
      v.literal("earn"),
      v.literal("redeem"),
      v.literal("refund")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    createdAt: v.number(),
  })
    .index("by_customerId", ["customerId"])
    .index("by_storeId", ["storeId"])
    .index("by_merchantId", ["merchantId"]),

  products: defineTable({
    merchantId: v.id("merchants"),
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),
    pointsCost: v.number(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_merchantId", ["merchantId"])
    .index("by_storeId", ["storeId"]),

  bannerAds: defineTable({
    title: v.string(),
    imageUrl: v.string(),
    targetUrl: v.string(),
    placement: v.union(
      v.literal("home"),
      v.literal("merchant"),
      v.literal("rewards")
    ),
    startDate: v.number(),
    endDate: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_placement", ["placement"]),
});
