import { notFound } from "next/navigation";
import { getPublishedArticleBySlug } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article || !article.publishedAt) notFound();

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <article className="hero-card mx-auto max-w-3xl rounded-xl2 border-[3px] border-border p-6 shadow-soft md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Artikel pembeli</p>
        <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">{article.title}</h1>
        <p className="mt-4 text-sm text-muted">Ditulis oleh {article.authorName}</p>
        {article.excerpt ? <p className="mt-5 rounded-xl border-[2px] border-border bg-surfaceSoft p-4 text-sm leading-7 text-muted">{article.excerpt}</p> : null}
        <div className="mt-6 whitespace-pre-line text-sm leading-8 text-text">{article.content}</div>
      </article>
    </main>
  );
}
