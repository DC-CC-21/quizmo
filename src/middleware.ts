import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import GetUserCookie from "./app/lib/GetUserCookie";
import AccountData from "./app/lib/AccountInterface";
import { sql } from "@vercel/postgres";

/**
 * Middleware function that checks if the user is authenticated for certain routes.
 * Redirects the user to the login page if they are not authenticated.
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function middleware(
  req: NextRequest
): Promise<NextResponse> {
  // Get the current path
  let path = req.nextUrl.pathname;
  // Get the user's cookies
  const userToken = await GetUserCookie();
  // Log the current path
  console.log("middleware", path);

  // Check if the user is trying to access the login page
  if (path.startsWith("/account/login")) {
    // If the user is already authenticated, redirect them to the home page
    if (userToken?.loggedIn) {
      console.log("redirected");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  // Check if the user is trying to access their profile page
  else if (path.startsWith("/account/profile")) {
    // If the user is not authenticated, redirect them to the login page
    if (!userToken?.loggedIn) {
      return NextResponse.redirect(
        new URL("/account/login", req.url)
      );
    } else {
      // Get the user's ID from the URL parameters
      const params = req.nextUrl.searchParams;
      const users_id = params.get("id");
      // Get the user's data from the cookies
      const userData = (await GetUserCookie()) as AccountData;
      // Check if the user is trying to access someone else's profile
      if (userData.users_id !== users_id) {
        return NextResponse.redirect(
          new URL("/api/account/logout?invalid=true", req.url)
        );
      }
    }
  }
  // Check if the user is trying to access a quiz page
  else if (path.startsWith("/quiz/play")) {
    // If the user is not authenticated, redirect them to a page indicating they are not authenticated
    if (!userToken?.loggedIn) {
      return NextResponse.redirect(
        new URL("/quiz/no-auth", req.url)
      );
    }
  }
  // Check if the user is trying to access an edit page
  else if (path.startsWith("/edit/")) {
    if (!userToken?.loggedIn) {
      // If the user is not authenticated, redirect them to a page indicating they are not authenticated
      return NextResponse.redirect(
        new URL("/quiz/no-auth", req.url)
      );
    } else {
      // Get the quiz ID from the URL
      const path = req.nextUrl.pathname.replace("/edit/", "");
      // Check if the user is allowed to edit the quiz
      const result =
        await sql`SELECT users_id FROM quiz WHERE quizzes_id = ${path} AND users_id = ${userToken.users_id}`;
      if (!result.rowCount) {
        // If the user is not allowed to edit the quiz, redirect them to a page indicating they are not authenticated
        return NextResponse.redirect(
          new URL("/quiz/no-auth", req.url)
        );
      } else {
        // If the user is allowed to edit the quiz, allow them to continue to the edit page
        return NextResponse.next();
      }
    }
  }
}

/**
 * Configuration object for the middleware.
 * @property {string[]} matcher - The routes that the middleware should match.
 */
export const config = {
  matcher: [
    "/account/login",
    "/account/profile/",
    "/quiz/play",
    "/edit/:path*",
  ],
};
