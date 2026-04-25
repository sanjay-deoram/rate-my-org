import { z } from "zod";

const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "temporary",
  "contract",
  "seasonal",
  "self_employed",
  "per_diem",
  "reserve",
  "freelance",
  "apprenticeship",
] as const;

export const reviewPostBodySchema = z
  .object({
    companySlug: z.string().min(1),
    overallRating: z.number().int().min(1).max(5),
    employmentStatus: z.enum(["current_employee", "former_employee"]),
    formerYear: z.number().int().min(1950).max(new Date().getFullYear()).nullable().optional(),
    employmentType: z.enum(EMPLOYMENT_TYPES),
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

export type ReviewPostBody = z.infer<typeof reviewPostBodySchema>;
