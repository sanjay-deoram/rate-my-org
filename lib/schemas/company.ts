import { createSelectSchema } from "drizzle-zod";
import { companies } from "@/drizzle/schema";

export const companySchema = createSelectSchema(companies);
export type Company = typeof companies.$inferSelect;
