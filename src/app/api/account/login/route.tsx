import AccountData from "@/app/lib/AccountInterface";
import SetUserCookie from "@/app/lib/SetUserCookie";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const bcrypt = require("bcrypt");

// Define the shape of the user object
const User = z.object({
  username: z.string().min(1, "Username is required"),
  pwd: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

/**
 * Handle the POST request for user login.
 * Validate the user input, connect to the database,
 * find the user in the database, and set cookies if the login is successful.
 * @param req - The NextRequest object containing the request data.
 * @returns A NextResponse object with a JSON payload.
 */
export async function POST(req: NextRequest) {
  // Parse the request body as JSON
  const body = await req.json();

  try {
    // Validate the user object against the defined schema
    User.parse(body);

    // Connect to the database
    const result =
      await sql`SELECT * FROM accounts WHERE username=${body.username}`;
    if (result.rows.length > 0) {
      const match = await bcrypt.compare(
        body.pwd,
        result.rows[0].user_password
      );
      if (match) {
        await SetUserCookie(result.rows[0] as AccountData);
        return NextResponse.json({ success: true });
      }
    } else {
      return NextResponse.json({
        error: ["Wrong username or password"],
      });
    }
  } catch (e: any) {
    // Log the error and return a JSON response with the error message
    console.error("Error", e);
    if (Array.isArray(e.errors)) {
      return NextResponse.json({ error: [e.errors[0].message] });
    } else {
      return NextResponse.json({ error: ["Server Error"] });
    }
  }
}
