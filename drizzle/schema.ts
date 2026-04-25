import { pgTable, pgEnum, uuid, text, smallint, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const interviewExperienceEnum = pgEnum("interview_experience", [
  "Great",
  "Neutral",
  "Negative",
]);
export const interviewOfferOutcomeEnum = pgEnum("interview_offer_outcome", [
  "Yes",
  "No",
  "Yes but Declined",
]);

export const companies = pgTable("companies", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry"),
  headquarters: text("headquarters"),
  website: text("website"),
  size: text("size"),
  founded: integer("founded"),
  description: text("description"),
  logoKey: text("logo_key"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const employmentStatusEnum = pgEnum("employment_status", [
  "current_employee",
  "former_employee",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
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
]);

export const reviews = pgTable("reviews", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  overallRating: smallint("overall_rating").notNull(),
  employmentStatus: employmentStatusEnum("employment_status").notNull(),
  formerYear: integer("former_year"),
  employmentType: employmentTypeEnum("employment_type").notNull(),
  jobTitle: text("job_title").notNull(),
  headline: text("headline").notNull(),
  pros: text("pros").notNull(),
  cons: text("cons").notNull(),
  adviceToManagement: text("advice_to_management").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const interviews = pgTable("interviews", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  roleTitle: text("role_title").notNull(),
  department: text("department"),
  difficulty: smallint("difficulty").notNull(),
  overallExperience: interviewExperienceEnum("overall_experience").notNull(),
  description: text("description").notNull(),
  offerReceived: interviewOfferOutcomeEnum("offer_received").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});
