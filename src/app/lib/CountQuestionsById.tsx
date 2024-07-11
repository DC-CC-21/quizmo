import { sql } from "@vercel/postgres";

/**
 * Asynchronously counts the number of questions in a quiz by its ID.
 *
 * @param {string} quizzes_id - The ID of the quiz to count questions for.
 * @return {Promise<number>} A promise that resolves to the number of questions in the quiz.
 */
export default async function CountQuestionsById(
  quizzes_id: string
): Promise<number> {
  try {
    // Query the database for the count of questions with the given quiz ID.
    const { rows } =
      await sql`SELECT COUNT(*) FROM questions WHERE quizzes_id=${quizzes_id}`;
    
    // If the query returns no rows, return 0.
    if (!rows) {
      return 0;
    } else {
      // Otherwise, log the rows and return the count from the first row.
      return rows[0].count;
    }
  } catch (error) {
    // If an error occurs, log it and return 0.
    console.error(error);
    return 0;
  }
}

