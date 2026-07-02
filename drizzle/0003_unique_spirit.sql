CREATE TYPE "public"."company_status" AS ENUM('pending', 'approved');--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "status" "company_status" DEFAULT 'approved' NOT NULL;
