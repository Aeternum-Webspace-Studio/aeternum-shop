export default function SellerPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ringkasan Seller</h1>
      <p className="mt-2 text-sm text-muted">Kelola produk, stok, order, dan manual delivery.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Produk aktif</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Order masuk</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Stok tersedia</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
      </div>
    </div>
  );
}
