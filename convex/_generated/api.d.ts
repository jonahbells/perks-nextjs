/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents from "../agents.js";
import type * as ambassadors from "../ambassadors.js";
import type * as auth from "../auth.js";
import type * as bannerAds from "../bannerAds.js";
import type * as customers from "../customers.js";
import type * as dashboard from "../dashboard.js";
import type * as http from "../http.js";
import type * as merchants from "../merchants.js";
import type * as partners from "../partners.js";
import type * as products from "../products.js";
import type * as stores from "../stores.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  ambassadors: typeof ambassadors;
  auth: typeof auth;
  bannerAds: typeof bannerAds;
  customers: typeof customers;
  dashboard: typeof dashboard;
  http: typeof http;
  merchants: typeof merchants;
  partners: typeof partners;
  products: typeof products;
  stores: typeof stores;
  transactions: typeof transactions;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
