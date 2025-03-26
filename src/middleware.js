import { NextResponse } from "next/server";

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    
    // Define public paths that do not require authentication
    const isPublicPath = path === '/login' || path === '/register' || path==='/';
    
    // Retrieve the token from cookies
    const token = request.cookies.get('token')?.value || '';

    // If user is already authenticated and tries to access public paths, redirect to home
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/home', request.nextUrl));
    }

    // If user is not authenticated and tries to access private paths, redirect to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Continue the request if the user is authenticated or accessing public paths
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/register',
        '/profile/:path*',
        '/verifyemail',
        '/home',
        '/user/:id',
        '/changeProfilePicture',
        
    ]
};
