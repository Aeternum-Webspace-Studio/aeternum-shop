import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { countAvailableStock, listProductsBySellerId } from "@/lib/products";
import { listOrderItemsBySellerId } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerPage() {
  const current = await getCurrentUser();
  const sellerId = current?.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const products = await listProductsBySellerId(sellerId);
  const orderItems = await listOrderItemsBySellerId(sellerId);
  const stockRows = await Promise.all(products.map(async (product) => ({ ...product, available: await countAvailableStock(product.id) })));

  return (
    <div>
      <div className="rounded-xl2 border-[3px] border-border bg-primary p-6 text-white shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">Seller dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Kelola produk, stok, order, dan delivery.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">Tambah produk baru, update stok digital, lihat order masuk, dan isi manual delivery tanpa muter-muter.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="rounded-xl border-[2px] border-white bg-white px-4 py-2 text-sm font-black text-primary" href="/seller/products/new">Tambah Produk</a>
          <a className="rounded-xl border-[2px] border-white bg-transparent px-4 py-2 text-sm font-black text-white" href="/seller/stocks">Kelola Stok</a>
          <form method="post" action="/api/auth/logout">
            <button className="rounded-xl border-[2px] border-white bg-white/10 px-4 py-2 text-sm font-black text-white">Logout</button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Produk aktif</p>
          <p className="mt-2 text-2xl font-black">{products.length}</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Order masuk</p>
          <p className="mt-2 text-2xl font-black">{orderItems.length}</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Stok tersedia</p>
          <p className="mt-2 text-2xl font-black">{stockRows.reduce((sum, item) => sum + item.available, 0)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <a href="/seller/products" className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft hover:bg-surfaceSoft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Produk</p>
          <h2 className="mt-2 text-xl font-black">Tambah atau edit produk</h2>
          <p className="mt-2 text-sm text-muted">Semua produk yang aktif tampil di marketplace dan halaman trending.</p>
        </a>
        <a href="/seller/orders" className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft hover:bg-surfaceSoft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Pesanan</p>
          <h2 className="mt-2 text-xl font-black">Cek order dan manual delivery</h2>
          <p className="mt-2 text-sm text-muted">Masuk ke detail order untuk kirim akses manual atau cek status.</p>
        </a>
      </div>
    </div>
  );
}
