import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-text">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted">Product detail</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          {product.categoryName ? <span className="rounded-full bg-white px-3 py-1">{product.categoryName}</span> : null}
          <span className="rounded-full bg-white px-3 py-1">{product.fulfillmentType === "auto" ? "Auto Kirim" : "Manual Seller"}</span>
          {product.isCustomPackage ? <span className="rounded-full bg-white px-3 py-1">Custom Package</span> : null}
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">{product.description}</p>
        <div className="mt-6 rounded-xl2 border border-border bg-white p-5 shadow-soft">
          <p className="text-sm text-muted">Harga</p>
          <p className="mt-1 text-2xl font-semibold">{formatMoney.format(product.price)}</p>
          {product.resellerPrice ? <p className="mt-1 text-sm text-muted">Harga reseller: {formatMoney.format(product.resellerPrice)}</p> : null}
          {product.instructions ? <p className="mt-4 whitespace-pre-line text-sm text-muted">{product.instructions}</p> : null}
        </div>
        <div className="mt-6 rounded-xl2 border border-border p-5 text-sm text-muted">
          Checkout dan delivery akan dihubungkan di tahap berikutnya.
        </div>
      </div>
    </main>
  );
}
