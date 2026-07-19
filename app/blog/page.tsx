import Link from "next/link";
import { listPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = await listPublishedArticles();

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Artikel</p>
        <h1 className="reveal-up mt-2 text-3xl font-black tracking-tight md:text-5xl">Panduan sebelum membeli produk digital.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Baca tips memilih akun premium, memahami akses produk, dan menjaga transaksi tetap aman.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.length === 0 ? (
            <div className="rounded-xl2 border-[3px] border-border bg-white p-6 text-sm text-muted shadow-soft">Belum ada artikel.</div>
          ) : (
            articles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="lift block rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Panduan pembeli</p>
                <h2 className="mt-3 text-xl font-black">{article.title}</h2>
                {article.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{article.excerpt}</p> : null}
                <p className="mt-5 border-t-[2px] border-border pt-4 text-xs font-black uppercase tracking-[0.16em] text-text">Baca artikel</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
