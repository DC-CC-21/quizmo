import AccountData from "@/app/lib/AccountInterface";
import SetUserCookie from "@/app/lib/SetUserCookie";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const bcrypt = require("bcrypt");

// Define the shape of the user object
const User = z.object({
  username: z.string().min(1, "Username is required"),
  user_email: z.string().email("Invalid email"),
  user_password: z
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

    // Check if the email is already in use
    const match =
      await sql`SELECT * FROM accounts WHERE user_email=${body.user_email}`;
    if (match.rows.length > 0) {
      return NextResponse.json({
        error: ["Email already in use"],
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(
      body.user_password,
      10
    );

    // Connect to the database
    const result = await sql`INSERT INTO accounts (username, user_email, user_password)
       VALUES (${body.username}, ${body.user_email}, ${passwordHash})`;
      
    if (result.rows.length > 0) {
      await SetUserCookie(result.rows[0] as AccountData);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        error: ["Failed to create account"],
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
