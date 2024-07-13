import GetUserCookie from "@/app/lib/GetUserCookie";
import AccountData from "@/app/lib/AccountInterface";
import QuizData from "@/app/lib/QuizData";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the user ID from the cookies
    let cookies = await GetUserCookie();
    let user_id = (cookies as AccountData).users_id;
    if (!user_id) {
      // If the user is not logged in, return an empty array
      return NextResponse.json({ rows: [] });
    }

    // Query the database for all quizzes that are editable by the current user
    const { rows } =
      await sql`SELECT * FROM quiz WHERE users_id=${user_id}`;
    if (!rows) {
      // If the query returns no rows, return an empty array
      return NextResponse.json({ rows: [] });
    } else {
      // If the query returns rows, cast them to QuizData[] and return them
      return NextResponse.json({ rows });
    }
  } catch (error) {
    // If an error occurs, log it and return an empty array
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching editable quizzes" },
      { status: 500 }
    );
  }
}
