import { getPublicInvoiceStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function InvoiceTrackerPage({
  searchParams
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const invoice = ((await searchParams).invoice ?? "").trim();
  const detail = invoice ? await getPublicInvoiceStatus(invoice) : null;

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Invoice tracker</p>
        <h1 className="reveal-up mt-2 text-3xl font-black tracking-tight md:text-5xl">Cek status pesanan dari nomor invoice.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Masukkan nomor invoice untuk melihat status pembayaran dan proses produk. Data akses produk tetap hanya tampil di akun pembeli.</p>

        <form className="mt-6 flex flex-col gap-3 rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft md:flex-row" action="/invoice-tracker">
          <input name="invoice" defaultValue={invoice} className="min-h-12 flex-1 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 text-sm font-semibold outline-none" placeholder="Contoh: INV..." required />
          <button className="lift shine rounded-xl border-[2px] border-border bg-primary px-5 py-3 text-sm font-black text-white shadow-soft">Cek Invoice</button>
        </form>

        {invoice ? (
          <section className="mt-8 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
            {detail ? (
              <>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{detail.orderNumber}</p>
                    <h2 className="mt-2 text-2xl font-black">Status: {detail.status}</h2>
                    <p className="mt-2 text-sm text-muted">Pembayaran: {detail.paymentStatus}</p>
                  </div>
                  <p className="rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-2 text-lg font-black">{formatMoney.format(detail.totalAmount)}</p>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {detail.items.map((item) => (
                    <article key={`${item.productName}-${item.deliveryStatus}`} className="lift rounded-xl border-[2px] border-border bg-surfaceSoft p-3">
                      <p className="text-sm font-black">{item.productName}</p>
                      <p className="mt-1 text-xs text-muted">Proses: {item.deliveryStatus}</p>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted">Invoice tidak ditemukan. Pastikan nomor invoice sesuai dengan yang ada di halaman pesanan.</p>
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}
