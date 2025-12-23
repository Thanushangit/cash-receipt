export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/dashboard/:path*', '/cash-receipt/:path*', '/money-letter/:path*']
};
