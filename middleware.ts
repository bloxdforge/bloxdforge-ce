import { NextRequest, NextResponse } from 'next/server';
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS: Record<string, number> = {
  '/api/ai': 20,
  '/api/download': 60,
  'default': 100,
};
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);
function getClientIdentifier(req: NextRequest): string {
  const reqWithIp = req as NextRequest & { ip?: string };
  const ip = reqWithIp.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return ip;
}
function checkRateLimit(identifier: string, pathname: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  let limit = RATE_LIMIT_MAX_REQUESTS['default'];
  if (pathname.startsWith('/api/download')) limit = RATE_LIMIT_MAX_REQUESTS['/api/download'];
  else if (RATE_LIMIT_MAX_REQUESTS[pathname]) limit = RATE_LIMIT_MAX_REQUESTS[pathname];
  const key = `${identifier}:${pathname.startsWith('/api/download') ? '/api/download' : pathname}`;
  const existing = rateLimitStore.get(key);
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: limit - 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
  }
  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: existing.resetTime };
  }
  existing.count++;
  return { allowed: true, remaining: limit - existing.count, resetTime: existing.resetTime };
}
const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];
const CSRF_EXEMPT_PATHS = new Set<string>();
function validateCSRF(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!origin || !host) {
    return false;
  }
  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/api/data/')) {
    const referer = req.headers.get('referer');
    const origin = req.headers.get('origin');
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) {
      const host = req.headers.get('host') || '';
      const validOrigin = origin ? origin.includes(host) : false;
      const validReferer = referer ? referer.includes(host) : false;
      if (!validOrigin && !validReferer) {
        return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
      }
    }
  }
  const clientIdentifier = getClientIdentifier(req);
  const rateLimitResult = checkRateLimit(clientIdentifier, pathname);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS[pathname] ?? RATE_LIMIT_MAX_REQUESTS['default']),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(rateLimitResult.resetTime / 1000)),
          'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
        }
      }
    );
  }
  if (CSRF_PROTECTED_METHODS.includes(req.method) && !CSRF_EXEMPT_PATHS.has(pathname)) {
    if (!validateCSRF(req)) {
      return NextResponse.json(
        { error: 'CSRF validation failed. Request blocked.' },
        { status: 403 }
      );
    }
  }
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS[pathname] ?? RATE_LIMIT_MAX_REQUESTS['default']));
  response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.floor(rateLimitResult.resetTime / 1000)));
  return response;
}
export const config = {
  matcher: ['/', '/api/:path*'],
};