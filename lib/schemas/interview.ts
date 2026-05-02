import { z } from "zod";

export const INTERVIEW_EXPERIENCES = ["Great", "Neutral", "Negative"] as const;
export const OFFER_OUTCOMES = ["Yes", "No", "Yes but Declined"] as const;

export type InterviewExperience = (typeof INTERVIEW_EXPERIENCES)[number];
export type OfferOutcome = (typeof OFFER_OUTCOMES)[number];

export const interviewPostBodySchema = z.object({
  companySlug: z.string().min(1, "Select a company"),
  roleTitle: z.string().min(1, "Role title is required").max(120),
  department: z.string().max(120).optional(),
  difficulty: z.number().int().min(1).max(5, "Select a difficulty rating"),
  overallExperience: z.enum(INTERVIEW_EXPERIENCES, { error: "Select an overall experience" }),
  description: z.string().min(10, "Please describe the interview process in more detail").max(5000),
  offerReceived: z.enum(OFFER_OUTCOMES, { error: "Select an offer outcome" }),
});

// Extends POST body with UI-only display fields — stripped before sending to API
export const interviewFormSchema = interviewPostBodySchema.and(
  z.object({ companyName: z.string().min(1) }),
);

export type InterviewPostBody = z.infer<typeof interviewPostBodySchema>;
export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
