export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ringkasan Buyer</h1>
      <p className="mt-2 text-sm text-muted">Riwayat order, payment, ticket, profile, dan reseller.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Order aktif</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Pesanan selesai</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Status reseller</p>
          <p className="mt-2 text-2xl font-semibold">Pending</p>
        </div>
      </div>
      <div className="mt-6 rounded-xl2 border border-border p-4">
        <p className="text-sm font-medium">Belum ada pesanan</p>
        <p className="mt-1 text-sm text-muted">Saat transaksi aktif, data order akan muncul di sini.</p>
      </div>
    </div>
  );
}
