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
      <h1 className="text-3xl font-semibold tracking-tight">Ringkasan Seller</h1>
      <p className="mt-2 text-sm text-muted">Kelola produk, stok, order, dan manual delivery.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Produk aktif</p>
          <p className="mt-2 text-2xl font-semibold">{products.length}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Order masuk</p>
          <p className="mt-2 text-2xl font-semibold">{orderItems.length}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Stok tersedia</p>
          <p className="mt-2 text-2xl font-semibold">{stockRows.reduce((sum, item) => sum + item.available, 0)}</p>
        </div>
      </div>
    </div>
  );
}
