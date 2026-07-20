import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { roleOrdersPath } from "@/lib/role-home";

export const dynamic = "force-dynamic";

export default async function AccountOrdersRedirectPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  redirect(roleOrdersPath(current.session.role));
}
