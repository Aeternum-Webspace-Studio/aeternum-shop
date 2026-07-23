import { listUsers } from "@/lib/users";
import { referralCodeForUser } from "@/lib/referrals.js";
import { getReferralStatsForCode } from "@/lib/referrals-data";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await listUsers();
  const usersWithReferrals = await Promise.all(
    users.map(async (user) => {
      const referralCode = referralCodeForUser(user);
      const referralStats = await getReferralStatsForCode(referralCode, 0);
      return { ...user, referralCode, referralCount: referralStats.count };
    })
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">User</h1>
      <p className="mt-2 text-sm text-muted">Daftar user dan status reseller.</p>
      <div className="mt-6 space-y-3">
        {usersWithReferrals.map((user) => (
          <article key={user.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="mt-1 text-sm text-muted">{user.email} · {user.role} · reseller {user.resellerStatus}</p>
                <p className="mt-1 text-xs text-muted">Referral {user.referralCode} · {user.referralCount} signup</p>
              </div>
              {user.resellerStatus === "pending" ? (
                <form className="flex gap-2" method="post" action={`/api/admin/resellers/${user.id}`}>
                  <button name="status" value="approved" className="rounded-xl border border-border bg-primary px-3 py-2 text-sm font-semibold text-white">Approve</button>
                  <button name="status" value="rejected" className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">Reject</button>
                </form>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
