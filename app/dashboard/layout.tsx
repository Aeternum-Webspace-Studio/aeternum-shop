import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/session-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  if (current.session.role !== "buyer") redirect(current.session.role === "admin" ? "/admin" : "/seller");

  return (
    <AppShell
      title="Buyer Dashboard"
      description={current ? `${current.user.name} • ${current.session.role}` : "Akun buyer"}
      homeHref="/dashboard"
      homeLabel="Dashboard"
      showChatbot={false}
      nav={[
        { href: "/dashboard", label: "Ringkasan" },
        { href: "/dashboard/orders", label: "Pesanan" },
        { href: "/dashboard/payments", label: "Pembayaran" },
        { href: "/dashboard/tickets", label: "Ticket" },
        { href: "/dashboard/profile", label: "Profil" },
        { href: "/dashboard/reseller", label: "Reseller" }
      ]}
      footer={<p className="text-xs text-muted">Buyer hanya melihat order miliknya.</p>}
    >
      {children}
    </AppShell>
  );
}
