import { listAdminArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const articles = await listAdminArticles();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Artikel</h1>
      <p className="mt-2 text-sm text-muted">Buat panduan pembeli dan artikel produk digital.</p>

      <form className="mt-6 grid gap-3 rounded-xl2 border border-border bg-white p-4 shadow-soft" method="post" action="/api/admin/articles">
        <input className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="title" placeholder="Judul artikel" required />
        <input className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="excerpt" placeholder="Ringkasan pendek" />
        <textarea className="min-h-40 rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="content" placeholder="Isi artikel" required />
        <select className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="status" defaultValue="published">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button className="rounded-xl border border-border bg-primary px-4 py-2 text-sm font-semibold text-white">Simpan artikel</button>
      </form>

      <div className="mt-6 space-y-3">
        {articles.length === 0 ? (
          <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada artikel.</div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
              <p className="font-semibold">{article.title}</p>
              <p className="mt-1 text-sm text-muted">{article.status} · /blog/{article.slug}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
