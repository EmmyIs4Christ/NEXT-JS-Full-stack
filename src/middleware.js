import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value || "";
  const path = req.nextUrl.pathname;
  const publicPath = path === "/sign-in" || path === "/sign-up";

  if (publicPath && path === "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (publicPath && token !== "") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!publicPath && token === "") {
    // Store the original URL in a cookie
    const cookie = `original-url=${path}; Path=/; HttpOnly`;

    // Redirect to login page
    return NextResponse.redirect(new URL("/sign-in", req.url), {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }

  // if (!isAuthenticated && pathname !== '/login') {
  //   // Store the original URL in a cookie
  //   const cookie = `original-url=${pathname}; Path=/; HttpOnly`;

  //   // Redirect to login page
  //   return NextResponse.redirect(new URL('/login', request.url), {
  //     headers: {
  //       'Set-Cookie': cookie,
  //     },
  //   });
}

export const config = {
  matcher: [
    "/sign-up",
    "/sign-in",
    // "/",
    "/onboard",
    "/membership",
    "/jobs",
    "/activity",
    "/account",
  ],
};
