CREATE TABLE IF NOT EXISTS "attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"entry_id" text NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entries" (
	"id" text PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"mood" integer,
	"attachments" text[] DEFAULT '{}' NOT NULL,
	"dirty" boolean DEFAULT false NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"last_synced_at" integer,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'attachments_entry_id_entries_id_fk'
	) THEN
		ALTER TABLE "attachments"
		ADD CONSTRAINT "attachments_entry_id_entries_id_fk"
		FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
