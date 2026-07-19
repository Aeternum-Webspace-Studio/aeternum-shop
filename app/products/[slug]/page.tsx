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
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Product detail</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">{product.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          {product.categoryName ? <span className="rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">{product.categoryName}</span> : null}
          <span className="rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">{product.fulfillmentType === "auto" ? "Auto Kirim" : "Manual Seller"}</span>
          {product.isCustomPackage ? <span className="rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">Custom Package</span> : null}
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">{product.description}</p>
        <div className="mt-6 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-muted">Harga</p>
          <p className="mt-1 text-2xl font-black">{formatMoney.format(product.price)}</p>
          {product.resellerPrice ? <p className="mt-1 text-sm text-muted">Harga reseller: {formatMoney.format(product.resellerPrice)}</p> : null}
          {product.instructions ? <p className="mt-4 whitespace-pre-line text-sm text-muted">{product.instructions}</p> : null}
        </div>
        <form className="mt-6 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft" method="post" action="/api/checkout">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value={1} />
          <button className="rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft">Checkout Pakasir</button>
        </form>
      </div>
    </main>
  );
}
