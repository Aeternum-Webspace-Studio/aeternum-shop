import { cookies } from "next/headers";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";
import { resolveSessionRole } from "@/lib/session-role.js";
import { findUserById } from "@/lib/users";

export async function getCurrentUser() {
  const token = (await cookies()).get(getSessionCookieName())?.value;
  const session = verifySessionToken(token);
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user) return null;

  return { session: { ...session, role: resolveSessionRole(session.role, user.role) }, user };
}
