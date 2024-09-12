import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import { isValidPassword } from "./lib/isValidPassword";
import { auth } from "./auth";
import NextAuth from "next-auth";
import authConfig from "./auth.config"
import { adminRoutes, authRoutes, publicRoutes } from "./routes";

const Role = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER', // add other roles as necessary
};

function isPublicRoute(pathname:any) {
    // Check if the path matches any static public route
    if (publicRoutes.includes(pathname)) {
      return true;
    }
    const dynamicRoutePattern = /^\/catalog\/[^/]+$/; // Match /catalog/ followed by any non-empty segment
    if (dynamicRoutePattern.test(pathname)) {
      return true;
    }

    return false;
  }

export default auth((req) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user.role;
    const url = req.nextUrl.clone();

    const isPublic = isPublicRoute(nextUrl.pathname);

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    const isAdminRoute = adminRoutes.includes(nextUrl.pathname)


    if (url.toString().startsWith('https://accounts.google.com')) {
        return NextResponse.next();
      }

    //PUBLIC
    if (isPublic) {
        return NextResponse.next();
    }

    //AUTH
    if(isAuthRoute && isLoggedIn){

       return NextResponse.next();
    }

    //ADMIN
    if (isAdminRoute) {
        //Checks if user is admin
        if (isLoggedIn && userRole === Role.ADMIN) {
            return NextResponse.next();
        }
        if (isLoggedIn && userRole !== Role.ADMIN) {
            const response = NextResponse.redirect(new URL('/auth/login', nextUrl));
            response.cookies.set('toastMessage', 'Not authorized to use page', { path: '/' ,httpOnly: false });
            return response;
        }
        return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }

    if(!isPublic && !isLoggedIn){
        return NextResponse.redirect(new URL('/auth/login',nextUrl))
    }
    return NextResponse.next()
})


export const config ={
    matcher: ['/', '/catalog/', '/basket/', '/basket/checkout', '/auth/:path*', '/payfast/', '/orders/', '/admin/:path*',
     // Static assets
    '/_next/image', // Next.js image optimization
    '/favicon.ico', // Favicon
    '/public/:path*', // Custom public folder
]
    
}