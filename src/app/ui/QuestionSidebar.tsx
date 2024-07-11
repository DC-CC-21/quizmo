"use client";
import { Dispatch } from "react";
import { QuestionData } from "../lib/QuizData";
import clsx from "clsx";

export default function QuestionSidebar({
  data,
  currentQuestionIndex,
  AddQuestionHandler,
  setCurrentQuestionIndex,
}: {
  data: QuestionData[];
  currentQuestionIndex: number;
  AddQuestionHandler: React.MouseEventHandler<HTMLButtonElement>;
  setCurrentQuestionIndex: Dispatch<number>;
}) {
  return (
    <div
      id="questions"
      className="border-b-4 mb-5 sm:border-b-0 sm:border-r-4 border-d_orange pr-2"
    >
      {/* Questions */}
      {data.map((question: QuestionData, index: number) => (
        <button
          // Button for each question
          className={clsx(
            "hover:animate-wiggle bg-blue-400 border-2 border-b-gray-400 w-full p-2 rounded-lg my-0.5",
            {
              "border-4 border-blue-500 border-b-blue-700":
                index === currentQuestionIndex,
            }
          )}
          type="button"
          id={index.toString()}
          key={index}
          onClick={() => {
            setCurrentQuestionIndex(index);
          }}
        >
          {question.question}
        </button>
      ))}
      {/* Button to add a question */}
      <button
        type="button"
        onClick={AddQuestionHandler}
        className="mx-auto w-[100%] block p-2 rounded-xl border border-white bg-lime-400 m-2"
      >
        Add Question
      </button>
    </div>
  );
}