import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

/**
 * Retrieves questions and their associated options from the database
 * based on the provided quizzes_id.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} A JSON response containing the questions and their options,
 *          or an error message if not found.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Extract the quizzes_id from the request URL parameters
  const params = req.nextUrl.searchParams;
  const quizzes_id = params.get("quizzes_id");

  try {
    // Query the database for the questions with the specified quizzes_id
    let { rows } =
      await sql`SELECT * FROM questions WHERE quizzes_id = ${quizzes_id};`;

    // Query the database for the quiz with the specified quizzes_id
    let { rows: quizRows } =
      await sql`SELECT * FROM quiz WHERE quizzes_id = ${quizzes_id};`;
    // If no rows are found, return a 404 error response
    if (!rows || !quizRows) {
      return NextResponse.json({
        error: true,
        status: 404,
        message: "Question not found",
      });
    } else {
      // For each question, query the database for its associated options
      rows = await Promise.all(
        rows.map(async (row) => {
          let options = (
            await sql`SELECT option_name FROM options WHERE questions_id = ${row.questions_id};`
          ).rows;

          // Convert the options to an array of option names
          options = options.map((option) => option.option_name);

          // Merge the question and its options into a single object
          let result = { ...row, options: options };
          return result;
        })
      );

      // Return the questions and their options as a JSON response
      return NextResponse.json({
        rows: rows,
        quizName: quizRows[0].quiz_name,
      });
    }
  } catch (error) {
    // If an error occurs, log it and return a 500 error response with the error message
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: true,
    });
  }
}

