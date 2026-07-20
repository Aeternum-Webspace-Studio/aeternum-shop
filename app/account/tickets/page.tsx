import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { roleTicketsPath } from "@/lib/role-home";

export const dynamic = "force-dynamic";

export default async function AccountTicketsRedirectPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  redirect(roleTicketsPath(current.session.role));
}
