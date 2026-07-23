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
