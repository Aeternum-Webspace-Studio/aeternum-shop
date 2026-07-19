import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { createSessionToken, hashPassword, getSessionCookieName } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const form = await request.formData();
  const payload = registerSchema.parse({
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password")
  });

  const db = getDb();
  const passwordHash = hashPassword(payload.password);
  const [user] = await db
    .insert(users)
    .values({ name: payload.name, email: payload.email.toLowerCase(), passwordHash })
    .returning();

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(getSessionCookieName(), createSessionToken({ userId: user.id, role: user.role }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
