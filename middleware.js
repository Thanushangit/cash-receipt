import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ['/dashboard', '/cash-receipt', '/money-letter'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If accessing a protected route without a token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/cash-receipt/:path*', '/money-letter/:path*']
};
