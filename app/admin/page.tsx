export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ringkasan Admin</h1>
      <p className="mt-2 text-sm text-muted">Kelola user, seller, produk, payment, ticket, dan paket custom.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">User</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Seller</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Order</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Payment</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
      </div>
    </div>
  );
}
