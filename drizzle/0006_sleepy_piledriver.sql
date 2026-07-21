ALTER TABLE "interviews" ADD COLUMN "submitter_id" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "submitter_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "interviews_company_submitter_idx" ON "interviews" USING btree ("company_id","submitter_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_company_submitter_idx" ON "reviews" USING btree ("company_id","submitter_id");