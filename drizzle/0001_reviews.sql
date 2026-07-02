CREATE TYPE "employment_status" AS ENUM('current_employee','former_employee');
--> statement-breakpoint
CREATE TYPE "employment_type" AS ENUM('full_time','part_time','temporary','contract','seasonal','self_employed','per_diem','reserve','freelance','apprenticeship');
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"overall_rating" smallint NOT NULL,
	"employment_status" "employment_status" NOT NULL,
	"former_year" integer,
	"employment_type" "employment_type" NOT NULL,
	"job_title" text NOT NULL,
	"headline" text NOT NULL,
	"pros" text NOT NULL,
	"cons" text NOT NULL,
	"advice_to_management" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_overall_rating_check" CHECK (overall_rating BETWEEN 1 AND 5),
	CONSTRAINT "reviews_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_company_id_idx" ON "reviews" ("company_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_created_at_idx" ON "reviews" ("created_at" DESC);
