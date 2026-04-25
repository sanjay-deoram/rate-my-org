import { z } from "zod";
import { EMPLOYMENT_TYPE_VALUES } from "@/constants/employment";

export const reviewPostBodySchema = z
  .object({
    companySlug: z.string().min(1),
    overallRating: z.number().int().min(1).max(5),
    employmentStatus: z.enum(["current_employee", "former_employee"]),
    formerYear: z.number().int().min(1950).max(new Date().getFullYear()).nullable().optional(),
    employmentType: z.enum(EMPLOYMENT_TYPE_VALUES),
    jobTitle: z.string().min(1).max(120),
    headline: z.string().min(1).max(200),
    pros: z.string().min(1).max(5000),
    cons: z.string().min(1).max(5000),
    adviceToManagement: z.string().min(1).max(5000),
  })
  .refine((d) => d.employmentStatus !== "former_employee" || d.formerYear != null, {
    message: "Year is required for former employees",
    path: ["formerYear"],
  });

// Extends POST body with UI-only display fields — stripped before sending to API
export const reviewFormSchema = reviewPostBodySchema.and(
  z.object({
    companyName: z.string().min(1, "Select a company"),
    companyLogoUrl: z.string().nullable(),
  }),
);

export type ReviewPostBody = z.infer<typeof reviewPostBodySchema>;
export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
