import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/session-server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  if (current.session.role !== "admin") redirect(current.session.role === "seller" ? "/seller" : "/dashboard");

  return (
    <AppShell
      title="Admin Dashboard"
      description={current ? `${current.user.name} • ${current.session.role}` : "Akun admin"}
      homeHref="/admin"
      homeLabel="Admin"
      nav={[
        { href: "/admin", label: "Ringkasan" },
        { href: "/admin/users", label: "User" },
        { href: "/admin/sellers", label: "Seller" },
        { href: "/admin/products", label: "Produk" },
        { href: "/admin/orders", label: "Pesanan" },
        { href: "/admin/payments", label: "Payment" },
        { href: "/admin/tickets", label: "Ticket" },
        { href: "/admin/reviews", label: "Review" },
        { href: "/admin/blog", label: "Blog" },
        { href: "/admin/packages", label: "Paket" },
        { href: "/admin/settings", label: "Settings" }
      ]}
      footer={<p className="text-xs text-muted">Admin punya akses penuh.</p>}
    >
      {children}
    </AppShell>
  );
}
