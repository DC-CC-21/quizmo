"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QuizData, { QuestionData } from "@/app/lib/QuizData";
import QuestionSidebar from "@/app/ui/QuestionSidebar";
import QuestionUpdate from "@/app/ui/QuestionUpdate";
import Messages from "@/app/ui/Messages";

/**
 * Component for editing a quiz.
 * @returns {JSX.Element} The Edit Quiz page.
 */
export default function QuizEditPage(): JSX.Element {
  /**
   * Adds a new question to the quiz data.
   * @returns {void}
   */
  function AddQuestionHandler(
    _: React.MouseEvent<HTMLButtonElement>
  ): void {
    if (!data) {
      console.warn("Cannot add question to undefined quiz");
      return;
    }
    const questionData: QuestionData[] = [...(data || [])];

    const newQuestion: QuestionData = {
      quizzes_id: "",
      questions_id: "",
      options: [],
      question: "New Question",
      answer: "Answer Here",
      types: "Both",
      isNew: true,
    };

    setData([...questionData, newQuestion]);
  }

  async function SaveChangesHandler() {
    console.log("Saved Changes");
    let res = await fetch(`/api/updateQuiz?quizzes_id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setMessages(["Saved Changes"]);
    } else {
      setMessages([...messages, "Failed to save changes"]);
    }
  }

  // Get the quiz name and id from the URL parameters
  const params = useParams();
  const id = params.slugs[0];

  // State variables for the quiz data, current question, and all options
  const [data, setData] = useState<QuestionData[]>();
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState<number>(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [quizName, setQuizName] = useState<string>("Loading...");

  // Fetch the quiz data from the API and set the state variables
  useEffect(() => {
    fetch(`/api/questionsById?quizzes_id=${id}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          setMessages([...messages, response.message]);
          return;
        }
        const data = response.rows;
        setQuizName(response.quizName);
        setData(data);

        let allOptions: Array<string> = [];
        data.forEach((question: QuestionData) => {
          allOptions.push(...question.options);
        });
      });
  }, [id, messages]);

  // Check if the quiz name and id are valid
  if (!id) return <div>Invalid Values</div>;

  // If the quiz data is not loaded, show a loading message
  if (!data) {
    return (
      <div>
        <Messages messages={messages} className="col-span-2" />
        {!messages.length && "Loading..."}
      </div>
    );
  }

  // Return the Edit Quiz page
  return (
    <main className="flex flex-col sm:grid sm:grid-cols-[30%,1fr] gap-2 p-2">
      <Messages messages={messages} className="col-span-2" />
      {/* Quiz name */}
      <h2 className="text-center text-2xl p-2 col-span-2">
        Quiz Name: {quizName}
      </h2>
      <QuestionSidebar
        data={data}
        currentQuestionIndex={currentQuestionIndex}
        AddQuestionHandler={AddQuestionHandler}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
      <QuestionUpdate
        setData={setData}
        currentQuestionIndex={currentQuestionIndex}
        data={data}
      />
      {/* Save button */}
      <button
        type="button"
        className="overflow-visible relative hover:bg-blue-500 col-span-2 m-2 rounded-full bg-l_blue text-white text-center p-2 w-2/3 mx-auto block"
        onClick={SaveChangesHandler}
      >
        {/* <div className="animate-[ping_1.5s_ease-in-out_infinite] absolute right-0 top-0 rounded-full bg-lime-300 border-[1px] border-sky-400 w-[15px] h-[15px]"></div>
        <div className="absolute right-0 top-0 rounded-full bg-lime-300 border-[1px] border-sky-400 w-[15px] h-[15px]"></div> */}
        Save Changes
      </button>
    </main>
  );
}
