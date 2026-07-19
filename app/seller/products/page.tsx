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
            <article key={product.id} className="rounded-xl2 border border-border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="text-sm text-muted">{product.slug}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatMoney.format(product.price)}</p>
                  <p className="text-xs text-muted">{product.fulfillmentType} • {product.status}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
