import { QuestionData } from "@/app/lib/QuizData";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

/**
 * This function handles POST requests to update a quiz with new questions
 * @param request - The NextRequest object containing the request body
 * @returns A NextResponse object with a success message on success, or an error message on failure
 */
export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const quizzes_id = params.get("quizzes_id");

  const body = await request.json();
  console.log(quizzes_id);
  console.log(body);

  // Check if the quiz ID is valid
  if (!quizzes_id || !isValidUUID(quizzes_id)) {
    return NextResponse.json({ error: "Missing Quiz Id" });
  }

  try {
    // Update quiz name
    if (body.quizName) {
      sql`UPDATE quiz SET quiz_name = ${body.quizName} WHERE quizzes_id = ${quizzes_id}`;
    }
    // Update visibility
    if (body.public !== undefined) {
      sql`UPDATE quiz SET public = ${body.public} WHERE quizzes_id = ${quizzes_id}`;
    }
    // For each question in the request body...
    body.data.forEach(async (question: QuestionData) => {
      if (question.isNew) {
        console.log("Adding Question");
        // If the question is new, insert it into the database
        let { rows } =
          await sql`INSERT INTO questions (question, answer, types, quizzes_id)
              VALUES (${question.question}, ${question.answer}, ${question.types}, ${quizzes_id}) RETURNING questions_id`;
        let questions_id = rows[0].questions_id;
        // Insert each option into the database
        question.options.forEach(async (option: string) => {
          await sql`INSERT INTO options (option_name, questions_id, quizzes_id)
              VALUES (${option}, ${questions_id}, ${quizzes_id})`;
        });
      } else {
        console.log("Updating Question");
        // If the question is not new, update the existing question
        await sql`UPDATE questions 
          SET question = ${question.question},
          answer = ${question.answer},
          types = ${question.types}
          WHERE questions_id = ${question.questions_id};`;
        // Delete all existing options for the question
        await sql`DELETE FROM options WHERE questions_id = ${question.questions_id}`;
        // Insert each new option into the database
        question.options.forEach(async (option: string) => {
          await sql`INSERT INTO options(option_name, questions_id, quizzes_id)
              VALUES (${option}, ${question.questions_id}, ${quizzes_id})`;
        });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to update" });
  }
}

/**
 * Checks if a string is a valid UUID
 * @param uuid - The string to check
 * @returns true if the string is a valid UUID, false otherwise
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
