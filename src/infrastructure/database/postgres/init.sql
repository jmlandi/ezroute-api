-- USERS
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

-- PLANS
CREATE TABLE IF NOT EXISTS "plans" (
  "tier" varchar PRIMARY KEY,
  "price" float NOT NULL,
  "max_workspaces" int NOT NULL,
  "max_members_per_workspace" int NOT NULL,
  "max_links_per_workspace" int NOT NULL
);

-- WORKSPACES
CREATE TABLE IF NOT EXISTS "workspaces" (
  "id" uuid PRIMARY KEY,
  "owner_id" uuid NOT NULL,
  "name" varchar,
  "status" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

-- WORKSPACE MEMBERS
CREATE TABLE IF NOT EXISTS "workspace_members" (
  "id" uuid PRIMARY KEY,
  "workspace_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" varchar,
  "created_at" timestamp,
  UNIQUE ("workspace_id", "user_id")
);

-- INVITES
CREATE TABLE IF NOT EXISTS "invites" (
  "id" uuid PRIMARY KEY,
  "workspace_id" uuid NOT NULL,
  "email" varchar NOT NULL,
  "invite_token" varchar UNIQUE NOT NULL,
  "status" varchar,
  "expires_at" timestamp,
  "created_at" timestamp
);

-- LINKS METADATA
CREATE TABLE IF NOT EXISTS "links_metadata" (
  "id" uuid PRIMARY KEY,
  "workspace_id" uuid NOT NULL,
  "created_by" uuid NOT NULL,
  "short_code" varchar UNIQUE NOT NULL,
  "original_url" text,
  "search_params" jsonb,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp
);

-- INDEXES
CREATE INDEX IF NOT EXISTS "idx_links_workspace" ON "links_metadata" ("workspace_id");
CREATE INDEX IF NOT EXISTS "idx_links_created_by" ON "links_metadata" ("created_by");

-- FOREIGN KEYS (safe add)
DO $$
BEGIN
  -- workspaces.owner_id → users.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'workspaces_owner_id_fkey'
  ) THEN
    ALTER TABLE "workspaces"
    ADD CONSTRAINT "workspaces_owner_id_fkey"
    FOREIGN KEY ("owner_id") REFERENCES "users" ("id")
    DEFERRABLE INITIALLY IMMEDIATE;
  END IF;

  -- workspace_members.workspace_id → workspaces.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'workspace_members_workspace_id_fkey'
  ) THEN
    ALTER TABLE "workspace_members"
    ADD CONSTRAINT "workspace_members_workspace_id_fkey"
    FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id")
    DEFERRABLE INITIALLY IMMEDIATE;
  END IF;

  -- workspace_members.user_id → users.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'workspace_members_user_id_fkey'
  ) THEN
    ALTER TABLE "workspace_members"
    ADD CONSTRAINT "workspace_members_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
    DEFERRABLE INITIALLY IMMEDIATE;
  END IF;

  -- invites.workspace_id → workspaces.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'invites_workspace_id_fkey'
  ) THEN
    ALTER TABLE "invites"
    ADD CONSTRAINT "invites_workspace_id_fkey"
    FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id")
    DEFERRABLE INITIALLY IMMEDIATE;
  END IF;

  -- links_metadata.workspace_id → workspaces.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'links_metadata_workspace_id_fkey'
  ) THEN
    ALTER TABLE "links_metadata"
    ADD CONSTRAINT "links_metadata_workspace_id_fkey"
    FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id")
    DEFERRABLE INITIALLY IMMEDIATE;
  END IF;

  -- links_metadata.created_by → users.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'links_metadata_created_by_fkey'
  ) THEN
    ALTER TABLE "links_metadata"
    ADD CONSTRAINT "links_metadata_created_by_fkey"
    FOREIGN KEY ("created_by") REFERENCES "users" ("id")
    DEFERRABLE INITIALLY IMMEDIATE;
  END IF;

  -- users.plan_tier → plans.tier
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'users_plan_tier_fkey'
  ) THEN
    ALTER TABLE "users"
    ADD CONSTRAINT "users_plan_tier_fkey"
    FOREIGN KEY ("plan_tier") REFERENCES "plans" ("tier")
    DEFERRABLE INITIALLY IMMEDIATE;
  END IF;
END $$;

-- SEED PLANS (idempotent)
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