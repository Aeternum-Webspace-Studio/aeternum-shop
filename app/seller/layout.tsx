import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/session-server";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentUser();

  return (
    <AppShell
      title="Seller Dashboard"
      description={current ? `${current.user.name} • ${current.session.role}` : "Akun seller"}
      homeHref="/seller"
      homeLabel="Seller"
      nav={[
        { href: "/seller", label: "Ringkasan" },
        { href: "/seller/products", label: "Produk" },
        { href: "/seller/orders", label: "Pesanan" },
        { href: "/seller/stocks", label: "Stok" },
        { href: "/seller/reviews", label: "Review" },
        { href: "/seller/tickets", label: "Ticket" },
        { href: "/seller/settings", label: "Settings" }
      ]}
      footer={<p className="text-xs text-muted">Seller hanya melihat data miliknya.</p>}
    >
      {children}
    </AppShell>
  );
}
