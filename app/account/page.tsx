import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { roleHome } from "@/lib/role-home";

export const dynamic = "force-dynamic";

export default async function AccountRedirectPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  redirect(roleHome(current.session.role));
}
