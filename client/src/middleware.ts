import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  // process.env.HOST_NAME must be set when deploying a multi-tenant setup
  const hostname = req.headers.get('host') || process.env.HOST_NAME || '';

  const isProd = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1';
  const currentHost = isProd
    ? // Replace both mintlify.app and mintlify.dev because both domains are used for hosting by Mintlify
      hostname.replace('.' + process.env.HOST_NAME, '')
    : hostname.replace('.localhost:3000', '');

  // may need this for self hosting one day:
  // rewrites for app pages
  // if (currentHost == 'app') {
  //   if (
  //     url.pathname === '/login' &&
  //     (req.cookies.get('next-auth.session-token') ||
  //       req.cookies.get('__Secure-next-auth.session-token'))
  //   ) {
  //     url.pathname = '/';
  //     return NextResponse.redirect(url);
  //   }

  //   url.pathname = `/app${url.pathname}`;
  //   return NextResponse.rewrite(url);
  // }

  // rewrite everything else to `/_sites/[site] dynamic route
  url.pathname = `/_sites/${currentHost}${url.pathname}`;

  return NextResponse.rewrite(url);
}
