import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // Skip folders built into NextJS
  const shouldNotApplyMiddleware = pathname.startsWith('/api/') || pathname.startsWith('/_next/');
  if (shouldNotApplyMiddleware) {
    return;
  }

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
