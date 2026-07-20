import Link from "next/link";
import { ChatbotLauncher } from "@/components/chatbot-launcher";

type NavItem = {
  href: string;
  label: string;
};

export function AppShell({
  title,
  description,
  nav,
  children,
  footer,
  homeHref,
  homeLabel
}: {
  title: string;
  description: string;
  nav: NavItem[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  homeHref: string;
  homeLabel: string;
}) {
  return (
    <main className="aeternum-bg relative min-h-screen text-text">
      <div className="border-b-[3px] border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Aeternum Shop</p>
            <p className="text-xs text-muted">Marketplace produk digital</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/blog">Blog</Link>
            <Link href={homeHref}>{homeLabel}</Link>
            <form method="post" action="/api/auth/logout" className="inline-flex">
              <button className="font-black text-primary">Logout</button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">{title}</p>
          <p className="mt-2 text-sm text-muted">{description}</p>
          <nav className="mt-6 space-y-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-lg border-[2px] border-transparent px-3 py-2 text-sm font-black text-text hover:border-border hover:bg-surfaceSoft">
                {item.label}
              </Link>
            ))}
          </nav>
          {footer ? <div className="mt-6 border-t-[2px] border-border pt-4">{footer}</div> : null}
        </aside>

        <section className="rounded-xl2 border-[3px] border-border bg-white p-6 shadow-soft">{children}</section>
      </div>

      <ChatbotLauncher docked />
    </main>
  );
}
