CREATE SCHEMA "goongoom";
--> statement-breakpoint
CREATE TABLE "goongoom"."answers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "goongoom"."answers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"question_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goongoom"."logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "goongoom"."logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ip_address" text,
	"geo_city" text,
	"geo_country" text,
	"geo_region" text,
	"geo_latitude" text,
	"geo_longitude" text,
	"user_agent" text,
	"referer" text,
	"accept_language" text,
	"user_id" text,
	"action" text NOT NULL,
	"payload" jsonb,
	"entity_type" text,
	"entity_id" integer,
	"success" integer NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goongoom"."questions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "goongoom"."questions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"recipient_clerk_id" text NOT NULL,
	"sender_clerk_id" text,
	"content" text NOT NULL,
	"is_anonymous" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goongoom"."users" (
	"clerk_id" text PRIMARY KEY NOT NULL,
	"bio" text,
	"social_links" jsonb,
	"question_security_level" text DEFAULT 'anyone' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "answers_question_id_idx" ON "goongoom"."answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "logs_user_id_idx" ON "goongoom"."logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "logs_created_at_idx" ON "goongoom"."logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "logs_action_idx" ON "goongoom"."logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "logs_entity_type_idx" ON "goongoom"."logs" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "logs_entity_id_idx" ON "goongoom"."logs" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "questions_recipient_clerk_id_idx" ON "goongoom"."questions" USING btree ("recipient_clerk_id");