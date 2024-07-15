import { cookies } from "next/headers";
import QuizData from "./QuizData";
import { sql } from "@vercel/postgres";
import GetUserCookie from "./GetUserCookie";

/**
 * Fetches all quizzes that are available to the current user from the database.
 * If the user is not logged in, only public quizzes are returned.
 *
 * @returns {Promise<QuizData[]>} An array of quizzes that are available to the current user.
 * @throws {Error} If the database connection fails.
 */
export default async function GetAvailableQuizzes(): Promise<QuizData[]> {
  try {
    // Connect to the database
    const user_id = (await GetUserCookie())?.users_id;
    const { rows } =
      await sql`SELECT * FROM quiz WHERE public=1 OR users_id=${user_id}`;
    if (!rows) {
      return [];
    } else {
      return rows as QuizData[];
    }
  } catch (error) {
    // If an error occurs, log it and return an empty array
    console.error(error);
    return [];
  }
}
