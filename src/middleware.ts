import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Production apex — requests here redirect to www (primary). */
const APEX_HOST = "thelakesvegas.com";
const CANONICAL_WWW_HOST = `www.${APEX_HOST}`;

export function middleware(request: NextRequest) {
  const raw = request.headers.get("host") ?? "";
  const host = raw.split(":")[0]?.toLowerCase();
  if (!host) return NextResponse.next();

  if (host.endsWith(".vercel.app") || host === "localhost") {
    return NextResponse.next();
  }

  if (host === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_WWW_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
