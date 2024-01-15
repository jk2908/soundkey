ALTER TABLE "auth_email_verification_token" RENAME TO "email_verification_token";--> statement-breakpoint
ALTER TABLE "auth_key" RENAME TO "key";--> statement-breakpoint
ALTER TABLE "auth_password_reset_token" RENAME TO "password_reset_token";--> statement-breakpoint
ALTER TABLE "auth_session" RENAME TO "session";--> statement-breakpoint
ALTER TABLE "auth_user" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "email_verification_token" DROP CONSTRAINT "auth_email_verification_token_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "key" DROP CONSTRAINT "auth_key_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "password_reset_token" DROP CONSTRAINT "auth_password_reset_token_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "auth_session_user_id_auth_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification_token" ADD CONSTRAINT "email_verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "key" ADD CONSTRAINT "key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
