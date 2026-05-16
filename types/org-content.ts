import type { OrgProfile } from "@/lib/queries/orgs";

export type Review = OrgProfile["reviews"][number];
export type Interview = OrgProfile["interviews"][number];
export type Tab = "reviews" | "interviews" | "both";
export type Sort = "recent" | "oldest" | "highest" | "lowest" | "hardest" | "easiest";
export type Experience = "Great" | "Neutral" | "Negative";
export type OfferOutcome = "Yes" | "No" | "Yes but Declined";
export type BothItem = (Review & { _kind: "review" }) | (Interview & { _kind: "interview" });
