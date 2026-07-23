create table if not exists "seller_withdrawal_requests" (
  "id" uuid primary key default gen_random_uuid(),
  "seller_id" uuid not null references "seller_profiles"("id") on delete cascade,
  "user_id" uuid not null references "users"("id") on delete cascade,
  "ticket_id" uuid references "tickets"("id") on delete set null,
  "amount" integer not null,
  "status" "withdrawal_status" not null default 'requested',
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "paid_at" timestamp with time zone
);

create index if not exists "seller_withdrawal_requests_seller_idx" on "seller_withdrawal_requests" ("seller_id");
create index if not exists "seller_withdrawal_requests_status_idx" on "seller_withdrawal_requests" ("status");
