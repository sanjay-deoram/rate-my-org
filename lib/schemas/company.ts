import { createSelectSchema } from "drizzle-zod";
import { companies } from "@/drizzle/schema";
import { z } from "zod";

export const companySchema = createSelectSchema(companies);
export type Company = typeof companies.$inferSelect;

export const createCompanySchema = z.object({
  name: z.string().min(2).max(100),
  headquarters: z.string().min(2).max(100),
  industry: z.string().min(2).max(100),
  website: z.string().url().optional().or(z.literal("")),
});

export type CreateCompanyPayload = z.infer<typeof createCompanySchema>;
