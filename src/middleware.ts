import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import GetUserCookie from "./app/lib/GetUserCookie";

export async function middleware(req: NextRequest) {
    let path = req.nextUrl.pathname
    const userToken = await GetUserCookie()
    console.log("middleware")
    if (path.startsWith("/account/login")) {
        console.log("login")
        if (userToken?.loggedIn) {
            console.log("redirected")
            return NextResponse.redirect(new URL("/", req.url))
        }
    } else if (path.startsWith("/quiz/play")){
        if (!userToken?.loggedIn) {
            return NextResponse.redirect(new URL("/quiz/no-auth", req.url))
        }
    }
}
export const config = {
    matcher: [
        "/account/login",
        "/quiz/play"
    ],
}