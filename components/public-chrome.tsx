"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type BuyerStats = {
  rank: number | null;
  totalTransactions: number;
  totalSpent: number;
};

const hiddenPrefixes = ["/dashboard", "/admin", "/seller"];

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const hidden = hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (hidden) return;

    let active = true;
    fetch("/api/buyer-stats")
      .then((response) => response.json())
      .then((data) => {
        if (active) setStats(data.stats ?? null);
      })
      .catch(() => {
        if (active) setStats(null);
      });

    return () => {
      active = false;
    };
  }, [hidden]);

  if (hidden) return <>{children}</>;

  return (
    <>
      <header className="sticky top-0 z-50 border-b-[3px] border-border bg-white/95 shadow-[0_5px_0_#111827] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <img className="h-11 w-11 rounded-lg shadow-soft" src="/icon.svg" alt="Aeternum Shop" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Aeternum Shop</p>
              <p className="text-xs text-muted">Toko produk digital terpercaya</p>
            </div>
          </a>

          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="/marketplace">Marketplace</a>
            <a href="/dashboard/orders">Pesanan Saya</a>
            <a href="/dashboard">Akun Saya</a>
          </nav>

          {stats ? (
            <div className="hidden gap-2 lg:flex">
              <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]">Peringkat {stats.rank ? `#${stats.rank}` : "baru"}</span>
              <span className="rounded-full border-[2px] border-border bg-primary px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white">{stats.totalTransactions} transaksi</span>
            </div>
          ) : null}
        </div>
      </header>

      <div className="border-b-[3px] border-border bg-primary py-3 text-white">
        <div className="ticker-track mx-auto flex max-w-7xl gap-8 overflow-hidden px-6 text-xs font-black uppercase tracking-[0.24em]">
          <span className="whitespace-nowrap">AI Tools</span>
          <span className="whitespace-nowrap">Streaming</span>
          <span className="whitespace-nowrap">Lisensi</span>
          <span className="whitespace-nowrap">Pantau Pesanan</span>
          <span className="whitespace-nowrap">Akses Cepat</span>
          <span className="whitespace-nowrap">Harga Jelas</span>
          <span className="whitespace-nowrap">Ticket Support</span>
        </div>
      </div>

      {children}

      <footer className="border-t-[3px] border-border bg-white px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <img className="h-10 w-10 rounded-lg shadow-soft" src="/icon.svg" alt="Aeternum Shop" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Aeternum Shop</p>
                <p className="text-xs text-muted">Produk digital dengan proses pembelian yang jelas.</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted">Cari produk, bayar aman, pantau pesanan, dan hubungi support kalau butuh bantuan.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black" href="/marketplace">Marketplace</a>
            <a className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black" href="/dashboard/orders">Pesanan</a>
            <a className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black" href="/dashboard/tickets">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}
