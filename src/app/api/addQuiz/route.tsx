import AccountData from "@/app/lib/AccountInterface";
import GetUserCookie from "@/app/lib/GetUserCookie";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const userData = (await GetUserCookie()) as AccountData;
    if (!userData?.users_id) {
      return NextResponse.json(
        { error: "User id not found" },
        { status: 500 }
      );
    }
    sql`INSERT INTO quiz (quizzes_id, quiz_name, public, users_id)
      VALUES (gen_random_uuid(), 'New Quiz', 0, ${userData.users_id})
      `;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
