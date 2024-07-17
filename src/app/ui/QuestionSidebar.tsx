"use client";
import { Dispatch, SetStateAction } from "react";
import { QuestionData } from "../lib/QuizData";
import clsx from "clsx";

export default function QuestionSidebar({
  data,
  currentQuestionIndex,
  AddQuestionHandler,
  setCurrentQuestionIndex,
  setData,
}: {
  data: QuestionData[];
  currentQuestionIndex: number;
  AddQuestionHandler: React.MouseEventHandler<HTMLButtonElement>;
  setCurrentQuestionIndex: Dispatch<number>;
  setData: Dispatch<SetStateAction<QuestionData[] | undefined>>;
}) {
  async function InputFromFile() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.click();
    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            const json = JSON.parse(e.target.result as string);
            InsertJSONData(json);
          }
        };
        reader.readAsText(file);
      }
    };
  }
  function InsertJSONData(newData: QuestionData[]) {
    if (!data || !setData || !newData) {
      console.warn("Cannot add question to undefined quiz");
      return;
    } else {
      let dataCopy = [...newData];
      let formattedJSONData = dataCopy.map((question: QuestionData) => {
        return {
          quizzes_id: "",
          questions_id: "",
          options: question.options || [],
          question: question.question || "New Question",
          answer: question.answer || "Answer Here",
          types: "Both",
          isNew: true,
          _id: 999,
        } as QuestionData;
      });
      console.log("Formatted json", formattedJSONData);
      setData([...data, ...formattedJSONData]);
      setCurrentQuestionIndex(data.length);
    }
  }
  function shortenQuestion(question: string): string {
    if (question.length > 25) {
      return question.substring(0, 25) + "...";
    }
    return question;
  }
  // console.log(data);
  return (
    <div
      id="questions"
      className="border-b-4 mb-5 sm:border-b-0 sm:border-r-4 border-d_orange pr-2 sm:max-h-[75vh] overflow-y-auto"
    >
      {/* Questions */}
      {data
        .sort((a: QuestionData, b: QuestionData) => a._id - b._id)
        .map((question: QuestionData, index: number) => (
          <button
            // Button for each question
            className={clsx(
              "hover:animate-wiggle bg-blue-400 border-2 border-b-gray-400 w-full p-2 rounded-lg my-0.5",
              {
                "border-4 border-blue-500 border-b-blue-700":
                  index === currentQuestionIndex,
              },
            )}
            type="button"
            id={index.toString()}
            key={index}
            onClick={() => {
              setCurrentQuestionIndex(index);
            }}
          >
            {shortenQuestion(question.question)}
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
      <button
        type="button"
        className="mx-auto w-[100%] block p-2 rounded-xl border border-white bg-lime-400 m-2"
        onClick={InputFromFile}
      >
        Import From File
      </button>
    </div>
  );
}
