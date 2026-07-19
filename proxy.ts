import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, verifyEdgeSessionToken } from "@/lib/edge-auth";

const protectedPrefixes = ["/dashboard", "/seller", "/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!protectedRoute) return NextResponse.next();

  const token = request.cookies.get(getSessionCookieName())?.value;
  const session = await verifyEdgeSessionToken(token);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/seller") && session.role === "buyer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/seller/:path*", "/admin/:path*"]
};
