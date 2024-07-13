"use client";

import { MouseEventHandler, useEffect, useState } from "react";
import QuizData from "../lib/QuizData";

type QuizCardProps = {
  quizData: QuizData;
  editMode?: boolean;
  deleteQuizHandler?: any;
  removeQuizHandler: (event:any) => Promise<void>;
};


/**
 * Component for displaying a quiz card.
 * @param {Object} props - The properties for the component.
 * @param {QuizData} props.quizData - The quiz data to display.
 * @param {boolean} [props.editMode] - Whether the card is in edit mode.
 * @returns {JSX.Element} The quiz card component.
 */
export default function QuizCard({
  quizData,
  editMode,
  removeQuizHandler,
}: QuizCardProps): JSX.Element {
  // Determine the path for the link based on whether edit mode is enabled or not
  let path = `/quiz?id=${quizData.quizzes_id}`;
  let editClasses = "";
  if (editMode) {
    path = `/edit/${quizData.quizzes_id}`;
    editClasses =
      "[&>div]:hover:border-b-red-600 [&_button]:hover:w-[40px]";
  }
  const [questionCount, setQuestionCount] = useState<number>(0);

  // Get the count of questions for the quiz
  useEffect(() => {
    (async () => {
      let res = await fetch(
        `/api/countQuestionsById?quizzes_id=${quizData.quizzes_id}`
      );
      let count = (await res.json()).count;
      setQuestionCount(count);
    })();
  });

  // Render the quiz card
  return (
    // The quiz card is a link to the quiz or edit mode
    <a
      className={`bg-l_blue p-0 rounded-lg ${editClasses} h-[6em] w-full`}
      href={path}
      onClick={removeQuizHandler}
    >
      {/* Display the quiz name */}
      <div className="transition-all text-xl p-0 mb-2 border-b-4 border-b-d_orange flex flex-row justify-between overflow-hidden">
        <span className="pt-2 pl-2">{quizData.quiz_name}</span>
        {/* If edit mode is enabled, display a settings icon */}
        {editMode && (
          <button
            type="button"
            data-id={quizData.quizzes_id}
            className="transition-all rounded-tr-md bg-red-600 text-white w-[40px] sm:w-[0px] h-[40px] text-sm overflow-hidden"
          >
            X
          </button>
        )}
      </div>
      {/* Display the number of questions in the quiz */}
      <p className="p-2 text-right">
        Questions: {questionCount}
      </p>
    </a>
  );
}
