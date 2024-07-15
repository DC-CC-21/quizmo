import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

/**
 * Asynchronously counts the number of questions in a quiz by its ID.
 *
 * @param {string} quizzes_id - The ID of the quiz to count questions for.
 * @return {Promise<number>} A promise that resolves to the number of questions in the quiz.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const params = req.nextUrl.searchParams;
  const quizzes_id = params.get("quizzes_id");
  try {
    // Query the database for the count of questions with the given quiz ID.
    const { rows } =
      await sql`SELECT COUNT(*) FROM questions WHERE quizzes_id=${quizzes_id}`;

    // If the query returns no rows, return 0.
    if (!rows) {
      return NextResponse.json({ count: 0 });
    } else {
      // Otherwise, log the rows and return the count from the first row.
      return NextResponse.json({ count: rows[0].count });
    }
  } catch (error) {
    // If an error occurs, log it and return 0.
    console.error(error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
