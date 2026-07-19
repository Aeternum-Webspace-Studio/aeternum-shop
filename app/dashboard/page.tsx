export default function DashboardPage() {
  return (
    <div>
      <div className="rounded-xl2 border-[3px] border-border bg-primary p-6 text-white shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">Buyer dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Pantau order, review, dan support dari satu tempat.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">Semua pesanan, invoice, ticket, dan status reseller ada di sini. Kalau butuh bantuan, pakai chatbot atau buka ticket dari order.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="rounded-xl border-[2px] border-white bg-white px-4 py-2 text-sm font-black text-primary" href="/dashboard/orders">Lihat Order</a>
          <a className="rounded-xl border-[2px] border-white bg-transparent px-4 py-2 text-sm font-black text-white" href="/help">Tanya Chatbot</a>
          <form method="post" action="/api/auth/logout">
            <button className="rounded-xl border-[2px] border-white bg-white/10 px-4 py-2 text-sm font-black text-white">Logout</button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Order aktif</p>
          <p className="mt-2 text-2xl font-black">0</p>
          <p className="mt-1 text-sm text-muted">Pesanan yang masih diproses.</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Pesanan selesai</p>
          <p className="mt-2 text-2xl font-black">0</p>
          <p className="mt-1 text-sm text-muted">Order delivered dan bisa direview.</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Status reseller</p>
          <p className="mt-2 text-2xl font-black">Pending</p>
          <p className="mt-1 text-sm text-muted">Ajukan dari menu reseller bila ingin harga khusus.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <a href="/marketplace" className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft hover:bg-surfaceSoft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Mulai belanja</p>
          <h2 className="mt-2 text-xl font-black">Cari produk terbaru</h2>
          <p className="mt-2 text-sm text-muted">Lihat produk aktif, rating, dan detail checkout.</p>
        </a>
        <a href="/dashboard/tickets" className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft hover:bg-surfaceSoft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Support</p>
          <h2 className="mt-2 text-xl font-black">Buka ticket jika ada kendala</h2>
          <p className="mt-2 text-sm text-muted">Cocok untuk akses belum masuk, invoice, atau pertanyaan pesanan.</p>
        </a>
      </div>
    </div>
  );
}
