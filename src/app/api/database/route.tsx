import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { accounts, quiz, ids, q_id } from "./testdata";
const bcrypt = require("bcrypt");

async function createUsersTable() {
  console.log("Creating accounts table");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const result = await sql`
      CREATE TABLE IF NOT EXISTS accounts (
      users_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(45) NOT NULL,
      user_email VARCHAR(45) NOT NULL,
      user_password VARCHAR(100) NOT NULL);
    `;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
async function createQuizTable() {
  console.log("Creating quiz table");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const result = await sql`
      CREATE TABLE IF NOT EXISTS quiz (
      quizzes_id UUID UNIQUE NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      quiz_name VARCHAR(45) NOT NULL,
      public INT NOT NULL DEFAULT 0,
      users_id UUID NOT NULL,
      CONSTRAINT fk_quiz_users1
          FOREIGN KEY (users_id)
          REFERENCES accounts (users_id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE
      );
    `;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
async function createQuestionsTable() {
  console.log("Creating questions table");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`CREATE TYPE quiz_type AS ENUM ('Multi', 'Fill', 'Both')`;

    const result = await sql`
      CREATE TABLE IF NOT EXISTS questions (
      _id SERIAL PRIMARY KEY,
      questions_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
      question VARCHAR(300) NOT NULL,
      answer VARCHAR(300) NOT NULL,
      types quiz_type NOT NULL DEFAULT 'Multi',
      quizzes_id UUID NOT NULL,
      CONSTRAINT fk_questions_quiz
          FOREIGN KEY (quizzes_id)
          REFERENCES quiz (quizzes_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
    `;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
async function createOptionsTable() {
  console.log("Creating options table");
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const result = await sql`
      CREATE TABLE IF NOT EXISTS options (
      _id SERIAL PRIMARY KEY,
      options_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
      option_name VARCHAR(300) NOT NULL,
      questions_id UUID NOT NULL,
      quizzes_id UUID NOT NULL,
      CONSTRAINT fk_options_questions1
          FOREIGN KEY (questions_id)
          REFERENCES questions (questions_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
      CONSTRAINT fk_options_quiz1
          FOREIGN KEY (quizzes_id)
          REFERENCES quiz (quizzes_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
    `;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
async function createTables() {
  try {
    const results = [];
    await createOptionsTable();
    let res = await createQuizTable();
    results.push(res);
    // res = await createQuestionsTable()
    // results.push(res);
    // res = await createOptionsTable()
    // results.push(res);
    // const result = await sql`DELETE TABLE Pets`;
    return NextResponse.json({ ...results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

async function seedAccounts() {
  try {
    accounts.forEach(async (account) => {
      let pwd = await bcrypt.hashSync(account.user_password, 10);
      sql`INSERT INTO accounts (username, user_email, user_password) VALUES (${account.username}, ${account.user_email}, ${pwd})`;
    });
    // let result = sql`

    // `
    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

async function seedQuizzes() {
  try {
    Object.keys(quiz).forEach((q, i) => {
      let quiz_name = q;
      let isPublic = 1;

      sql`INSERT INTO quiz(quiz_name, public, users_id)
            VALUES (${quiz_name}, ${isPublic}, '71e693eb-5306-4f66-9389-789e871b61f4')`;
    });
    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

async function seedQuestions() {
  try {
    Object.keys(quiz).forEach((q: any) => {
      let value = (quiz as any)[q];
      value.forEach((v: any) => {
        console.log("\n", v.question);
        console.log(v.answer);
        console.log((ids as any)[q], "\n");
        sql`INSERT INTO questions (question, answer, types, quizzes_id)
              VALUES (${v.question}, ${v.answer}, 'Both', ${(ids as any)[q]})`;
      });
    });
    return NextResponse.json({ quiz });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}

async function seedOptions() {
  try {
    Object.keys(quiz).forEach((q: any) => {
      let value = (quiz as any)[q];
      value.forEach((v: any) => {
        if (v.options) {
          v.options.forEach((o: any) => {
            console.log("\n");
            console.log(o);
            console.log((ids as any)[q]);
            console.log((q_id as any)[v.question], "\n");
            // sql`INSERT INTO options (option_name, questions_id, quizzes_id)
            //       VALUES (${o}, ${(q_id as any)[v.question]}, ${(ids as any)[q]})`;
          });
        }
      });
    });
    return NextResponse.json({ quiz });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}

export async function GET() {
  // return createQuizTable();
  // return createQuestionsTable()
  return createOptionsTable();
  // return createTables();
  // return await seedAccounts()
  // return await seedQuizzes();
  // return await seedOptions();
  return NextResponse.json("Not Implemented");
}
