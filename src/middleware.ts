import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const ROLES = {
  USER: process.env.USER as string,
  ADMIN: process.env.ADMIN as string,
};

// Map routes to allowed roles
const protectedRoutes: { [path: string]: string[] } = {
  '/admin': [ROLES.ADMIN], // Only admins allowed here
  '/wishlist': [ROLES.USER], // Only users allowed here
  '/account-details': [ROLES.USER], // Only users allowed here
  '/cart': [ROLES.USER],
  '/checkout': [ROLES.USER],
  '/orders': [ROLES.USER],

};

const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret });

  if (!token) {
    // If no login token at all, redirect to login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const userRoles = (token.roles as string[]) || [];
  const cleanPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  for (const route in protectedRoutes) {
    if (cleanPathname.startsWith(route)) {
      const allowedRoles = protectedRoutes[route];
      const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
  
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      return NextResponse.next();
    }
  }
  

  // If path doesn't match any protected route, allow by default
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/wishlist/:path*', 
    '/account-details/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
  ],
};
