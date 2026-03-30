import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Content-Security-Policy tuned for this app:
 * - next/font (self-hosted under _next/static)
 * - Tailwind / Next inline styles
 * - Cloudflare Turnstile (script + iframe + fetch to challenges.cloudflare.com)
 * - POST /api/send (connect-src 'self')
 *
 * Default: enforcing Content-Security-Policy. Set CSP_ENFORCE=false for report-only tuning.
 */
function buildContentSecurityPolicy(request: NextRequest): string {
  const directives = [
    "default-src 'self'",
    // Next.js may emit inline scripts; Turnstile loads from Cloudflare.
    // 'unsafe-eval' keeps some dev/prod Next runtimes working; remove if reports stay clean.
    `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
  ];

  const proto = request.headers.get("x-forwarded-proto");
  if (proto === "https" || request.nextUrl.protocol === "https:") {
    directives.push("upgrade-insecure-requests");
  }

  const reportUri = process.env.CSP_REPORT_URI?.trim();
  if (reportUri) {
    directives.push(`report-uri ${reportUri}`);
  }

  return directives.join("; ");
}

/**
 * Applies baseline security headers and CSP (report-only or enforced).
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  const proto = request.headers.get("x-forwarded-proto");
  if (proto === "https") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  const csp = buildContentSecurityPolicy(request);
  const enforce = process.env.CSP_ENFORCE !== "false";

  if (enforce) {
    response.headers.set("Content-Security-Policy", csp);
  } else {
    response.headers.set("Content-Security-Policy-Report-Only", csp);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * All paths except Next internals and common static assets (faster, avoids unnecessary work).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
