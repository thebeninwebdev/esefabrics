// middleware.ts
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

  // Find the required roles for the current path
  const matchingRoute = Object.keys(protectedRoutes).find((path) => pathname.startsWith(path));
  const requiredRoles = matchingRoute ? protectedRoutes[matchingRoute] : [];

  // If the route is not protected, continue normally
  if (!requiredRoles.length) {
    return NextResponse.next();
  }

  // Retrieve the session token from the request
  const token = await getToken({ req, secret });

  // If no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Extract user roles from the token; assume token.roles is an array of string role IDs
  const userRoles: string[] = token.roles as string[] || [];

  // Check if the user has any of the required roles
  const hasAccess = userRoles.some((role) => requiredRoles.includes(role));

  if (!hasAccess) {
    // Redirect to an unauthorized page if access is denied
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Allow the request to proceed if access is granted
  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'], // Specify routes that trigger the middleware
};