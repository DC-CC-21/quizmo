import { NextRequest, NextResponse } from "next/server";
import {sql} from "@vercel/postgres";
/**
 * Retrieves a quiz from the database based on the provided quizzes_id.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} A JSON response containing the quiz data if found, or an error message if not.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    // Extract the quizzes_id from the request URL parameters
    const params = req.nextUrl.searchParams;
    const quizzes_id = params.get("quizzes_id");

    try {
        // Query the database for the quiz with the specified quizzes_id
        let {rows} = await sql`SELECT * FROM quiz WHERE quizzes_id = ${quizzes_id};`;

        // Log the retrieved rows
        console.log(rows);

        // If no rows are found, return a 404 error response
        if(!rows) {
            return NextResponse.json({status: 404, message: "Quiz not found"});
        }

        // Return the first row as a JSON response
        return NextResponse.json(rows[0]);
    } catch (error) {
        // If an error occurs, return a 500 error response with the error message
        return NextResponse.json({status:500, message: error});
    }
}
