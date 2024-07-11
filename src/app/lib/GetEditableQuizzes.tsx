import { cookies } from "next/headers";
import QuizData from "./QuizData";
import { sql } from "@vercel/postgres";

/**
 * Fetches all quizzes that are editable by the current user from the database.
 * If the user is not logged in, an empty array is returned.
 *
 * @returns {Promise<QuizData[]>} An array of quizzes that are editable by the current user.
 * @throws {Error} If the database connection fails.
 */
export default async function GetEditableQuizzes(): Promise<QuizData[]> {
  try {
    // Get the user ID from the cookies
    const user_id = cookies().get("id")?.value;
    if (!user_id) {
      // If the user is not logged in, return an empty array
      return [];
    }

    // Query the database for all quizzes that are editable by the current user
    const { rows } = await sql`SELECT * FROM quiz WHERE users_id=${user_id}`;
    if (!rows) {
      // If the query returns no rows, return an empty array
      return [];
    } else {
      // If the query returns rows, cast them to QuizData[] and return them
      return rows as QuizData[];
    }
  } catch (error) {
    // If an error occurs, log it and return an empty array
    console.error(error);
    return [];
  }
}
