import Link from "next/link";
import { listProductsBySellerId } from "@/lib/products";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function SellerProductsPage() {
  const current = await getCurrentUser();
  const sellerId = current?.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const products = await listProductsBySellerId(sellerId);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Produk</h1>
          <p className="mt-2 text-sm text-muted">Kelola produk digital milikmu.</p>
        </div>
        <Link href="/seller/products/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">
          Tambah Produk
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {products.length === 0 ? (
          <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada produk.</div>
          ) : (
            products.map((product) => (
              <article key={product.id} className="rounded-xl2 border border-border p-4 shadow-soft">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-semibold">{product.name}</h2>
                    <p className="text-sm text-muted">{product.slug}</p>
                    {product.isCustomPackage ? <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-primary">Custom package</p> : null}
                  </div>
                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <div className="text-right">
                      <p className="font-semibold">{formatMoney.format(product.price)}</p>
                      <p className="text-xs text-muted">{product.fulfillmentType} • {product.status}</p>
                    </div>
                    <Link href={`/seller/products/${product.id}`} className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm font-semibold">
                      Edit
                    </Link>
                  </div>
                </div>
              </article>
          ))
        )}
      </div>
    </div>
  );
}
