-- Tables creation
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "handle" varchar UNIQUE NOT NULL,
  "first_name" varchar,
  "password_hash" varchar NOT NULL,
  "profile_picture_url" varchar,
  "newsletter_subscribed" boolean DEFAULT false,
  "plan_tier" varchar NOT NULL,
  "plan_paid" boolean DEFAULT false,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "updated_at" timestamp,
  "handle_updated_at" timestamp,
  "plan_last_paid_at" timestamp
);

CREATE TABLE IF NOT EXISTS "plans" (
  "tier" varchar PRIMARY KEY,
  "price" float not null,
  "max_workspaces" int not null,
  "max_members_per_workspace" int not null,
  "max_links_per_workspace" int not null
);

CREATE TABLE IF NOT EXISTS "workspaces" (
  "id" uuid PRIMARY KEY,
  "owner_id" uuid NOT NULL,
  "name" varchar,
  "status" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE IF NOT EXISTS "workspace_members" (
  "id" uuid PRIMARY KEY,
  "workspace_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" varchar,
  "created_at" timestamp
);

CREATE TABLE IF NOT EXISTS "invites" (
  "id" uuid PRIMARY KEY,
  "workspace_id" uuid NOT NULL,
  "email" varchar NOT NULL,
  "invite_token" varchar UNIQUE NOT NULL,
  "status" varchar,
  "expires_at" timestamp,
  "created_at" timestamp
);

CREATE TABLE IF NOT EXISTS "links_metadata" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL,
  "created_by" uuid NOT NULL,
  "short_code" varchar UNIQUE NOT NULL,
  "original_url" text,
  "search_params" jsonb,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp
);

-- Table relationship
CREATE UNIQUE INDEX ON "workspace_members" ("workspace_id", "user_id");

CREATE INDEX ON "links_metadata" ("workspace_id");

CREATE INDEX ON "links_metadata" ("created_by");

ALTER TABLE "workspaces" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "workspace_members" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "workspace_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "invites" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "links_metadata" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "links_metadata" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "users" ADD FOREIGN KEY ("plan_tier") REFERENCES "plans" ("tier") DEFERRABLE INITIALLY IMMEDIATE;


-- Indepotent insert
INSERT INTO "plans" ("tier", "price", "max_workspaces", "max_members_per_workspace", "max_links_per_workspace")
SELECT * FROM (
  VALUES
    ('free',       0,     1,  3,  15),
    ('starter',    7.90,  3,  5,  30),
    ('pro',        27.90, 6,  10, 60),
    ('enterprise', 47.90, 12, 20, 120)
) AS new_plans ("tier", "price", "max_workspaces", "max_members_per_workspace", "max_links_per_workspace")
WHERE NOT EXISTS (
  SELECT 1 FROM "plans" p WHERE p."tier" = new_plans."tier"
);

