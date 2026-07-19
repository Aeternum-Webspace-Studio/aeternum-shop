create table if not exists "activity_logs" (
  "id" uuid primary key default gen_random_uuid(),
  "actor_id" uuid references "users"("id") on delete set null,
  "action" text not null,
  "entity_type" text,
  "entity_id" text,
  "metadata" jsonb not null,
  "created_at" timestamp with time zone not null default now()
);

create index if not exists "activity_logs_actor_idx" on "activity_logs" ("actor_id");
create index if not exists "activity_logs_action_idx" on "activity_logs" ("action");
create index if not exists "activity_logs_created_idx" on "activity_logs" ("created_at");
