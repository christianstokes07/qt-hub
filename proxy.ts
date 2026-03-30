import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware((auth, req) => {
  const cookie = req.cookies.get("site-access");
  const isPasswordPage = req.nextUrl.pathname === "/enter";
  const isApiCheck = req.nextUrl.pathname === "/api/check-password";
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev && !cookie && !isPasswordPage && !isApiCheck) {
    return NextResponse.redirect(new URL("/enter", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};