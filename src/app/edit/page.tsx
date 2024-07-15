"use client";
import clsx from "clsx";
import QuizCard from "../ui/QuizCard";
import QuizData from "../lib/QuizData";
import Messages from "../ui/Messages";
import { useState, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
/**
 * Asynchronous function that renders the Home page with editable quizzes.
 * @returns {JSX.Element} The main component for the Home page.
 */
export default function QuizEditHome() {
  async function addQuizHandler() {
    let res = await fetch("/api/addQuiz", {
      method: "POST",
    });
    if (!res.ok) {
      setMessages([...messages, "Failed to add quiz"]);
    } else {
      await loadQuizzes();
      setMessages([...messages, "Added quiz"]);
    }
  }
  async function removeQuizHandler(event: MouseEvent) {
    let target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() !== "button") {
      return;
    }
    event.preventDefault();
    let data_id = target.getAttribute("data-id");
    if (!data_id) {
      setMessages([...messages, "Failed to delete quiz"]);
      return;
    }
    let res = await fetch(
      `/api/deleteQuiz?quizzes_id=${data_id}`,
      {
        method: "POST",
      }
    );
    if (!res.ok) {
      setMessages([...messages, "Failed to delete quiz"]);
    } else {
      await loadQuizzes();
      setMessages([...messages, "Deleted quiz"]);
    }
  }
  async function loadQuizzes() {
    let res = await fetch("/api/getEditableQuizzes/");
    let rows = (await res.json()).rows;
    setData(rows);
  }

  const router = useRouter();
  const [data, setData] = useState<QuizData[]>([]);
  const [messages, setMessages] = useState<string[]>([]);

  // Fetch editable quizzes data
  useEffect(() => {
    loadQuizzes();
  }, []);

  // If no quizzes are found, display a message
  if (!data || !data.length) {
    return <Messages messages={["No Quizzes Found"]} />;
  }

  // Render the main component for the Home page
  return (
    <main
      className={clsx(
        "grid grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-3",
        "p-2 gap-2"
      )}
    >
      <Messages
        messages={messages}
        className="sm:col-span-2 md:col-span-3"
      />
      {data.map((quizElement: QuizData, index) => (
        // Render each quiz card component
        <QuizCard
          key={`${quizElement.quiz_name}${index}`}
          quizData={quizElement}
          editMode={true}
          removeQuizHandler={removeQuizHandler}
        />
      ))}
      {/* Button for adding a new quiz */}
      <button
        type="button"
        className={`
          [&>div]:hover:animate-[spin_2s_linear_reverse_infinite]
          [&>img]:hover:animate-[spin_2s_linear_infinite]
          transition-all duration-500 hover:bg-lime-500 bg-blue-500 w-full h-[6em] rounded-lg relative addBtn`}
        onClick={addQuizHandler}
      >
        <div className="origin-center opacity-0 absolute top-[calc(50%-2em)] left-[calc(50%-2em)] bg-lime-600 transition-all duration-500 addBtn-bg w-[4em] h-[4em]"></div>
        <img
          className="mx-auto w-10 h-10 transition-all duration-500 text-4xl opacity-0 text-white addBtn-add"
          src="/largeImages/addBtn.png"
          alt="Add Button"
        />
        <span className="transition-all duration-500 text-xl addBtn-text">
          Add Quiz
        </span>
      </button>
    </main>
  );
}
