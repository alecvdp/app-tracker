export type PricingType = "free" | "paid";
export type AppStatus = "using" | "not_using" | "watching" | "sunset";
export type SubscriptionPlan = "monthly" | "yearly" | "one-time" | "";
export type Platform =
  | "iOS"
  | "Android"
  | "Web"
  | "macOS"
  | "Windows"
  | "Linux";

export interface App {
  id: number;
  name: string;
  pricingType: PricingType;
  subscriptionPlan: string | null;
  nextDueDate: string | null;
  platforms: string;
  status: AppStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const ALL_PLATFORMS: Platform[] = [
  "iOS",
  "Android",
  "Web",
  "macOS",
  "Windows",
  "Linux",
];

export const STATUS_CONFIG: Record<
  AppStatus,
  { label: string; color: string; bg: string }
> = {
  using: { label: "Using", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  not_using: { label: "Not Using", color: "text-neutral-400", bg: "bg-neutral-500/10 border-neutral-500/20" },
  watching: { label: "Watching", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  sunset: { label: "Sunset", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export const SUBSCRIPTION_PLANS: { value: string; label: string }[] = [
  { value: "", label: "None" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "one-time", label: "One-time" },
];
