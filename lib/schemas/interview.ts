import { z } from "zod";

export const INTERVIEW_EXPERIENCES = ["Great", "Neutral", "Negative"] as const;
export const OFFER_OUTCOMES = ["Yes", "No", "Yes but Declined"] as const;

export const ROUND_TYPES = [
  "OA (Online Assessment)",
  "Phone Screen",
  "Technical",
  "Behavioral",
  "Technical + Behavioral",
  "System Design",
  "Take-Home",
  "Presentation",
  "HR / Culture",
  "Final / Offer",
  "Other",
] as const;

export type InterviewExperience = (typeof INTERVIEW_EXPERIENCES)[number];
export type OfferOutcome = (typeof OFFER_OUTCOMES)[number];
export type RoundType = (typeof ROUND_TYPES)[number];

export const roundSchema = z.object({
  type: z.enum(ROUND_TYPES),
  notes: z.string().min(1, "Add notes for this round").max(1000),
});

export const interviewPostBodySchema = z.object({
  companySlug: z.string().min(1, "Select a company"),
  roleTitle: z.string().min(1, "Role title is required").max(120),
  department: z.string().max(120).optional(),
  difficulty: z.number().int().min(1).max(5, "Select a difficulty rating"),
  overallExperience: z.enum(INTERVIEW_EXPERIENCES, { error: "Select an overall experience" }),
  rounds: z.array(roundSchema).min(1, "Add at least one round"),
  offerReceived: z.enum(OFFER_OUTCOMES, { error: "Select an offer outcome" }),
});

export const interviewFormSchema = interviewPostBodySchema.and(
  z.object({ companyName: z.string().min(1) }),
);

export type InterviewPostBody = z.infer<typeof interviewPostBodySchema>;
export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
