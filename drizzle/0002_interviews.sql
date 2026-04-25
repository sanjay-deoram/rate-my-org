CREATE TYPE "interview_experience" AS ENUM('Great','Neutral','Negative');
--> statement-breakpoint
CREATE TYPE "interview_offer_outcome" AS ENUM('Yes','No','Yes but Declined');
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"role_title" text NOT NULL,
	"department" text,
	"difficulty" smallint NOT NULL,
	"overall_experience" "interview_experience" NOT NULL,
	"description" text NOT NULL,
	"offer_received" "interview_offer_outcome" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "interviews_difficulty_check" CHECK (difficulty BETWEEN 1 AND 5),
	CONSTRAINT "interviews_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "interviews_company_id_idx" ON "interviews" ("company_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "interviews_created_at_idx" ON "interviews" ("created_at" DESC);
