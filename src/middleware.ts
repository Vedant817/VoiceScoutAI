import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    // If user is authenticated and tries to access signin/signup, redirect to dashboard
    if (
      session &&
      (request.nextUrl.pathname === "/signin" ||
        request.nextUrl.pathname === "/signup")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user is not authenticated and tries to access dashboard, redirect to signin
    if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(`Middleware Error: ${error}`);
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/signin", "/signup", "/dashboard/:path*"],
};
