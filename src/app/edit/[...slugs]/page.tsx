"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import QuizData, { QuestionData } from "@/app/lib/QuizData";
import QuestionSidebar from "@/app/ui/QuestionSidebar";
import QuestionUpdate from "@/app/ui/QuestionUpdate";
import Messages from "@/app/ui/Messages";
import SlideButton from "@/app/ui/SlideButton";

/**
 * Component for editing a quiz.
 * @returns {JSX.Element} The Edit Quiz page.
 */
export default function QuizEditPage(): JSX.Element {
  /**
   * Adds a new question to the quiz data.
   * @returns {void}
   */
  function AddQuestionHandler(_: React.MouseEvent<HTMLButtonElement>): void {
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
      _id: 999,
    };
    setCurrentQuestionIndex(data.length);
    setData([...questionData, newQuestion]);
  }

  /**
   * Saves changes to the quiz data by sending a POST request to the
   * /api/updateQuiz endpoint with the quiz data in the request body.
   * If the request is successful, the quiz data is reloaded and a success
   * message is added to the messages state variable. If the request fails,
   * an error message is added to the messages state variable.
   *
   * @returns {Promise<void>} Promise that resolves when the function completes.
   */
  async function SaveChangesHandler(): Promise<void> {
    // Log that changes are being saved
    console.log("Saved Changes");
    // Send a POST request to the /api/updateQuiz endpoint with the quiz data
    let res = await fetch(`/api/updateQuiz?quizzes_id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
        public: visibilityOptions.indexOf(visibility),
        quizName: quizName,
      }),
    });

    // If the request is successful, reload the quiz data and add a success message
    if (res.ok) {
      loadData();
      setMessages(["Saved Changes"]);
    } else {
      // If the request fails, add an error message
      setMessages([...messages, "Failed to save changes"]);
    }
  }

  /**
   * Asynchronously loads quiz data by fetching questions for a specific quiz ID.
   * Sets the quiz name and data in the component state.
   *
   * @returns {void}
   */
  async function loadData(): Promise<void> {
    // Fetch questions for the specified quiz ID
    fetch(`/api/questionsById?quizzes_id=${id}`)
      .then((res) => res.json())
      .then((response) => {
        // Handle error response
        if (response.error) {
          setMessages([...messages, response.message]);
          return;
        }
        const data = response.rows;
        setQuizName(response.quizName);
        setData(data);
        setVisibility(visibilityOptions[response.public]);
        console.log(response);
        // Extract all options from the questions
        let allOptions: Array<string> = [];
        data.forEach((question: QuestionData) => {
          allOptions.push(...question.options);
        });
      });
  }

  // Get the quiz name and id from the URL parameters
  const params = useParams();
  const id = params.slugs[0];
  const visibilityOptions = ["Private", "Public"];

  // State variables for the quiz data, current question, and all options
  const [data, setData] = useState<QuestionData[]>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [quizName, setQuizName] = useState<string>("Loading...");
  const [visibility, setVisibility] = useState<string>("Private");

  // Fetch the quiz data from the API and set the state variables
  useEffect(() => {
    loadData();
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
      <label className="text-center text-2xl p-2 col-span-2" htmlFor="quizName">
        Quiz Name:{" "}
        <input
          id="quizName"
          name="quizName"
          type="text"
          className="p-1 w-full"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
      </label>
      <div className="col-span-2 w-full sm:w-1/2 mx-auto block p-2">
        <h3 className="">Visibility</h3>
        <SlideButton
          btnNames={visibilityOptions}
          className="col-end-2"
          setValue={setVisibility}
          defaultValue={visibilityOptions.indexOf(visibility)}
        />
      </div>
      <div className="col-span-2 border-b-4 border-d_orange"></div>
      <QuestionSidebar
        data={data}
        currentQuestionIndex={currentQuestionIndex}
        AddQuestionHandler={AddQuestionHandler}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        setData={setData}
      />
      <QuestionUpdate
        setData={setData}
        currentQuestionIndex={currentQuestionIndex}
        data={data}
        key={currentQuestionIndex}
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
