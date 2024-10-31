import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Define roles using values from environment variables as strings
const ROLES = {
  USER: process.env.USER as string,
  ADMIN: process.env.ADMIN as string,
};

// Define access rules for each protected route
const protectedRoutes: { [path: string]: string[] } = {
  '/admin': [ROLES.ADMIN], // Only accessible by 'ADMIN' role
  '/dashboard': [ROLES.USER], // Only accessible by 'USER' role
};

// Secret used to sign the JWT, should match the one in your NextAuth configuration
const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve the session token from the request
  const token = await getToken({ req, secret });

  // If no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Extract user roles from the token; assume token.roles is an array of string role IDs
  const userRoles: string[] = token.roles as string[] || [];

  // Check if user has access to the admin page first
  const adminRequiredRoles = protectedRoutes['/admin'];
  const hasAdminAccess = userRoles.some((role) => adminRequiredRoles.includes(role));

  if (pathname.startsWith('/dashboard')) {
    // Redirect to /admin if user has admin access
    if (hasAdminAccess) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Check if the user has access to the dashboard
    const dashboardRequiredRoles = protectedRoutes['/dashboard'];
    const hasDashboardAccess = userRoles.some((role) => dashboardRequiredRoles.includes(role));

    // If user has access to the dashboard, allow the request to proceed
    if (hasDashboardAccess) {
      return NextResponse.next();
    }

    // Redirect to /unauthorized if access is denied for both /admin and /dashboard
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // For any other route, continue normally
  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'], // Specify routes that trigger the middleware
};
