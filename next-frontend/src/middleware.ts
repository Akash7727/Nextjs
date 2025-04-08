import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const publicRoutes = ["/auth/login", "/auth/signup"];
    const privateRoutes = ["auth/dashboard"];

    if (privateRoutes.some((route) => pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }

    if (publicRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL("auth/dashboard", req.nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/dashboard/:path*", "/auth/:path*"]
};