import type { SubscriptionTier } from "@/types";

const PRO_EMAILS = new Set([
  "thepreethu01@gmail.com",
]);

export function isProUser(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (PRO_EMAILS.has(normalized)) return true;
  const envList = (process.env.ADMIN_PRO_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return envList.includes(normalized);
}

/** All known paid entitlement slugs, grouped by tier (highest first). */
const TIER_ENTITLEMENTS: ReadonlyArray<{
  tier: SubscriptionTier;
  slugs: readonly string[];
}> = [
  {
    tier: "ultra",
    slugs: ["ultra-plan", "ultra-monthly-plan", "ultra-yearly-plan"],
  },
  { tier: "team", slugs: ["team-plan"] },
  {
    tier: "pro-plus",
    slugs: ["pro-plus-plan", "pro-plus-monthly-plan", "pro-plus-yearly-plan"],
  },
  {
    tier: "pro",
    slugs: ["pro-plan", "pro-monthly-plan", "pro-yearly-plan"],
  },
];

/**
 * Safely coerce a raw entitlements value (from a JWT or session) into a
 * typed string array.
 */
export function parseEntitlements(
  raw: unknown,
  userEmail?: string | null,
): string[] {
  const list = Array.isArray(raw)
    ? raw.filter((e: unknown): e is string => typeof e === "string")
    : [];
  if (isProUser(userEmail) && !list.includes("ultra-plan")) {
    list.push("ultra-plan");
  }
  return list;
}

/**
 * Resolve the highest subscription tier present in an entitlements list.
 * Returns `"free"` when no paid entitlement matches.
 */
export function resolveSubscriptionTier(
  entitlements: readonly string[],
  userEmail?: string | null,
): SubscriptionTier {
  if (isProUser(userEmail)) {
    return "ultra";
  }
  for (const { tier, slugs } of TIER_ENTITLEMENTS) {
    if (slugs.some((s) => entitlements.includes(s))) {
      return tier;
    }
  }
  return "free";
}

export function hasPaidEntitlement(
  entitlements: readonly string[],
  userEmail?: string | null,
): boolean {
  return resolveSubscriptionTier(entitlements, userEmail) !== "free";
}
