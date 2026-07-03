ALTER TABLE "interviews" ADD COLUMN "rounds" jsonb;
--> statement-breakpoint
UPDATE "interviews" SET "rounds" = jsonb_build_array(jsonb_build_object('type', 'Other', 'notes', description));
--> statement-breakpoint
ALTER TABLE "interviews" ALTER COLUMN "rounds" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "interviews" DROP COLUMN "description";
