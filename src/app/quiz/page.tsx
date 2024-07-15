"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QuizData from "../lib/QuizData";
import Link from "next/link";
import SlideButton from "../ui/SlideButton";

/**
 * Component for displaying a quiz and enabling the user to select the number of questions to play.
 * @returns {JSX.Element} The Quiz page.
 */
export default function QuizPage(): JSX.Element {
  // State variables for the number of questions and the quiz data
  const [questionCount, setQuestionCount] = useState("5");
  const params = useSearchParams()
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const quizzes_id = params.get("id")
  // Fetch the quiz data when the component mounts or when the quizzes_id parameter changes
  useEffect(() => {
    async function load() {
      fetch(`/api/quizById?quizzes_id=${quizzes_id}`)
        .then(res => res.json())
      .then(data => setQuiz(data))
    }
    load()
  }, [quizzes_id])

  // Display a loading message if the quiz data is not yet available
  if (!quiz) return <div>Loading...</div>;

  // Render the quiz page
  return (
    <main className="mx-auto w-2/3 border-2 border-l_blue my-2 p-2 rounded-md">
      {/* Display the quiz name */}
      <h2 className="text-2xl text-center border-b-2 border-b-d_blue mb-2">
        {quiz.quiz_name}
      </h2>
      {/* Display a form to select the number of questions to play */}
      <div>
        <div
          id="questionCount"
          className="flex flex-col justify-center items-center [&>label]:w-40 sm:grid sm:grid-cols-2 sm:w-[80%]  sm:mx-auto gap-2 p-2"
        >
          <h3 className="text-xl text-center w-full sm:col-span-2">Questions</h3>
          {/* Radio buttons to select the number of questions */}
          {/* <label htmlFor="5question">
            5 Questions:
            <input
              type="radio"
              name="question"
              id="5question"
              defaultChecked
              onClick={() => setQuestionCount(5)}
            />
          </label>
          <label htmlFor="10question">
            10 Questions:
            <input
              type="radio"
              name="question"
              id="10question"
              onClick={() => setQuestionCount(10)}
            />
          </label>
          <label htmlFor="30question">
            30 Questions:
            <input
              type="radio"
              name="question"
              id="30question"
              onClick={() => setQuestionCount(15)}
            />
          </label>
          <label htmlFor="Aquestion">
            All Questions:
            <input
              type="radio"
              name="question"
              id="Aquestion"
              onClick={() => setQuestionCount(-1)}
            />
          </label> */}
          <SlideButton btnNames={["5", "10", "15", "All"]} className="w-full col-span-2 [&>span]:bg-lime-400 [&>span]:border [&>span]:border-l_blue" maxRows={2} setValue={setQuestionCount}/>
        </div>
      </div>
      {/* Link to start the quiz */}
      <Link
        href={`/quiz/play?id=${quizzes_id}&count=${questionCount}`}
        className="transition-all hover:rounded-md hover:w-full rounded:lg p-2 bg-lime-300 border-2 border-white block w-1/3 mx-auto text-center"
      >
        Play
      </Link>
    </main>
  );
}

