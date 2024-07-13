import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const params = req.nextUrl.searchParams;
    const quizzes_id = params.get("quizzes_id");
  try {
    if (!quizzes_id) {
      return NextResponse.json(
        { error: "Quiz id not found" },
        { status: 500 }
      );
    }
    await sql`DELETE FROM options WHERE quizzes_id=${quizzes_id}`;
    await sql`DELETE FROM questions WHERE quizzes_id=${quizzes_id}`;
    await sql`DELETE FROM quiz WHERE quizzes_id=${quizzes_id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
