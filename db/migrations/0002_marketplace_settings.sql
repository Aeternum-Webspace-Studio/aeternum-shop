create table if not exists "marketplace_settings" (
  "id" uuid primary key default gen_random_uuid(),
  "app_name" text not null default 'Aeternum Shop',
  "support_email" text,
  "announcement" text,
  "checkout_enabled" boolean not null default true,
  "updated_at" timestamp with time zone not null default now()
);
