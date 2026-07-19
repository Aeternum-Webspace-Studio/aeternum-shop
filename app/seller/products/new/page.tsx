export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Tambah Produk</h1>
      <p className="mt-2 text-sm text-muted">Buat produk digital baru.</p>

      <form className="mt-6 grid gap-4" method="post" action="/api/seller/products">
        <input className="rounded-xl border border-border px-4 py-3" name="name" placeholder="Nama produk" required />
        <textarea className="min-h-32 rounded-xl border border-border px-4 py-3" name="description" placeholder="Deskripsi produk" required />
        <textarea className="min-h-24 rounded-xl border border-border px-4 py-3" name="instructions" placeholder="Instruksi penggunaan" />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border border-border px-4 py-3" name="price" type="number" placeholder="Harga normal" required />
          <input className="rounded-xl border border-border px-4 py-3" name="resellerPrice" type="number" placeholder="Harga reseller" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <select className="rounded-xl border border-border px-4 py-3" name="fulfillmentType" defaultValue="manual">
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
          <select className="rounded-xl border border-border px-4 py-3" name="status" defaultValue="active">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isCustomPackage" />
          Custom package
        </label>
        <button className="rounded-xl bg-primary px-4 py-3 font-medium text-white">Simpan Produk</button>
      </form>
    </div>
  );
}
