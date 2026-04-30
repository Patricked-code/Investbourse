import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/admin", "/espace-institutionnel"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function hasLocalAdminBypass(request: NextRequest) {
  const allowBypass = process.env.NEXT_PUBLIC_ENABLE_LOCAL_ADMIN_BYPASS === "true";
  const isDevelopment = process.env.NODE_ENV !== "production";
  const bypassCookie = request.cookies.get("investbourse_admin_bypass")?.value === "enabled";

  return isDevelopment && allowBypass && bypassCookie;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("investbourse_session")?.value;

  if (sessionCookie || hasLocalAdminBypass(request)) {
    const response = NextResponse.next();
    response.headers.set("x-investbourse-protected-route", "true");
    return response;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  loginUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/espace-institutionnel/:path*"],
};
