import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import GetUserCookie from "./app/lib/GetUserCookie";
import AccountData from "./app/lib/AccountInterface";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  let path = req.nextUrl.pathname;
  const userToken = await GetUserCookie();
  console.log("middleware", path);
  if (path.startsWith("/account/login")) {
    if (userToken?.loggedIn) {
      console.log("redirected");
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else if (path.startsWith("/account/profile")) {
    if (!userToken?.loggedIn) {
      return NextResponse.redirect(new URL("/account/login", req.url));
    } else {
      const params = req.nextUrl.searchParams;
      const users_id = params.get("id");
      const userData = (await GetUserCookie()) as AccountData;
      if (userData.users_id !== users_id) {
        return NextResponse.redirect(
          new URL("/api/account/logout?invalid=true", req.url),
        );
      }
    }
  } else if (path.startsWith("/quiz/play")) {
    if (!userToken?.loggedIn) {
      return NextResponse.redirect(new URL("/quiz/no-auth", req.url));
    }
  }
}
export const config = {
  matcher: ["/account/login", "/account/profile/", "/quiz/play"],
};
