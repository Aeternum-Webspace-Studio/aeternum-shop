import { getCurrentUser } from "@/lib/session-server";

export const dynamic = "force-dynamic";

export default async function DashboardResellerPage() {
  const current = await getCurrentUser();
  const status = current?.user.resellerStatus ?? "none";

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Reseller</h1>
      <p className="mt-2 text-sm text-muted">Status pengajuan harga khusus.</p>
      <div className="mt-6 rounded-xl2 border border-border bg-white p-4 shadow-soft">
        <p className="text-sm font-semibold">Status: {status}</p>
        <p className="mt-2 text-sm text-muted">Jika approved, akun bisa memakai harga khusus pada produk yang menyediakan harga reseller.</p>
        {status === "none" || status === "rejected" ? (
          <form className="mt-4" method="post" action="/api/reseller/request">
            <button className="rounded-xl border border-border bg-primary px-4 py-2 text-sm font-semibold text-white">Ajukan reseller</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
