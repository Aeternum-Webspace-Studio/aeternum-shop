do $$ begin
  create type "wallet_transaction_type" as enum ('credit', 'debit', 'adjustment');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type "withdrawal_status" as enum ('requested', 'approved', 'paid', 'rejected');
exception
  when duplicate_object then null;
end $$;

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

create table if not exists "seller_wallet_transactions" (
  "id" uuid primary key default gen_random_uuid(),
  "seller_id" uuid not null references "seller_profiles"("id") on delete cascade,
  "order_item_id" uuid references "order_items"("id") on delete set null,
  "withdrawal_request_id" uuid references "seller_withdrawal_requests"("id") on delete set null,
  "type" "wallet_transaction_type" not null,
  "gross_amount" integer not null default 0,
  "platform_fee" integer not null default 0,
  "net_amount" integer not null,
  "note" text,
  "created_at" timestamp with time zone not null default now()
);

create index if not exists "seller_wallet_transactions_seller_idx" on "seller_wallet_transactions" ("seller_id");
create index if not exists "seller_wallet_transactions_type_idx" on "seller_wallet_transactions" ("type");
