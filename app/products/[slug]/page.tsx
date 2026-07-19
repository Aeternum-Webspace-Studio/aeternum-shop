export default function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-muted">Product detail</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{slug}</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">Halaman detail produk untuk harga, rating, instruksi, delivery, dan checkout.</p>
      </div>
    </main>
  );
}
