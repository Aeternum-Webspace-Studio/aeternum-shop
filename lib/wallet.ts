import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { sellerProfiles, sellerWithdrawalRequests, users } from "@/db/schema";

let sellerWithdrawalRequestsReady: Promise<void> | null = null;

function isMissingDatabaseObjectError(error: unknown) {
  const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
  return code === "42P01" || code === "42704";
}

async function ensureSellerWithdrawalRequestsTable() {
  if (!sellerWithdrawalRequestsReady) {
    sellerWithdrawalRequestsReady = (async () => {
      const db = getDb();
      await db.execute(sql`
        do $$ begin
          create type "wallet_transaction_type" as enum ('credit', 'debit', 'adjustment');
        exception
          when duplicate_object then null;
        end $$;
      `);
      await db.execute(sql`
        do $$ begin
          create type "withdrawal_status" as enum ('requested', 'approved', 'paid', 'rejected');
        exception
          when duplicate_object then null;
        end $$;
      `);
      await db.execute(sql`
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
        )
      `);
      await db.execute(sql`create index if not exists "seller_withdrawal_requests_seller_idx" on "seller_withdrawal_requests" ("seller_id")`);
      await db.execute(sql`create index if not exists "seller_withdrawal_requests_status_idx" on "seller_withdrawal_requests" ("status")`);
    })().catch((error) => {
      sellerWithdrawalRequestsReady = null;
      throw error;
    });
  }

  return sellerWithdrawalRequestsReady;
}

export async function createSellerWithdrawalRequest(input: { sellerId: string; userId: string; ticketId?: string | null; amount: number }) {
  await ensureSellerWithdrawalRequestsTable();
  const db = getDb();
  const [request] = await db.insert(sellerWithdrawalRequests).values({
    sellerId: input.sellerId,
    userId: input.userId,
    ticketId: input.ticketId ?? null,
    amount: input.amount,
    status: "requested"
  }).returning();
  return request ?? null;
}

export async function listWithdrawalRequests() {
  try {
    await ensureSellerWithdrawalRequestsTable();
    const db = getDb();
    return db
      .select({
        id: sellerWithdrawalRequests.id,
        amount: sellerWithdrawalRequests.amount,
        status: sellerWithdrawalRequests.status,
        createdAt: sellerWithdrawalRequests.createdAt,
        ticketId: sellerWithdrawalRequests.ticketId,
        sellerStoreName: sellerProfiles.storeName,
        userName: users.name
      })
      .from(sellerWithdrawalRequests)
      .innerJoin(sellerProfiles, eq(sellerWithdrawalRequests.sellerId, sellerProfiles.id))
      .innerJoin(users, eq(sellerWithdrawalRequests.userId, users.id))
      .orderBy(desc(sellerWithdrawalRequests.createdAt));
  } catch (error) {
    if (isMissingDatabaseObjectError(error)) return [];
    throw error;
  }
}
