DO $$ BEGIN
 CREATE TYPE "message_type" AS ENUM('message', 'system_message');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'system';--> statement-breakpoint
DROP TABLE "key";--> statement-breakpoint
ALTER TABLE "email_verification_token" RENAME COLUMN "expires" TO "expires_at";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "from_user_id" TO "sender_id";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "to_user_id" TO "recipient_ids";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "content" TO "body";--> statement-breakpoint
ALTER TABLE "password_reset_token" RENAME COLUMN "expires" TO "expires_at";--> statement-breakpoint
ALTER TABLE "email_verification_token" DROP CONSTRAINT "email_verification_token_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "message_from_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "message_thread_id_thread_id_fk";
--> statement-breakpoint
ALTER TABLE "password_reset_token" DROP CONSTRAINT "password_reset_token_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "thread_to_user" DROP CONSTRAINT "thread_to_user_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "thread_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "recipient_ids" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "thread" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "thread_to_user" ALTER COLUMN "thread_id" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "thread_to_user" ALTER COLUMN "thread_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "message_type" "message_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "thread" ADD COLUMN "message_ids" varchar(15)[] NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "hashed_password" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification_token" ADD CONSTRAINT "email_verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thread_to_user" ADD CONSTRAINT "thread_to_user_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "thread"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thread_to_user" ADD CONSTRAINT "thread_to_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "active_expires";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "idle_expires";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");