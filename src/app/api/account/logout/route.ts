import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const cookie = cookies();
  cookie.delete("quiz_secure");
  cookie.delete("quiz_token");
  if (params.get("invalid")) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  } else {
    return NextResponse.json({ success: true });
  }
}
