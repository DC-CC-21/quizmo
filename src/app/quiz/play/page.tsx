"use client";
import { QuestionData } from "@/app/lib/QuizData";
import { shuffleArray } from "@/app/lib/Shuffle";
import Messages from "@/app/ui/Messages";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
/**
 * Selects a random question from the given quiz data and updates the quiz data by removing the selected question.
 *
 * @param {QuestionData[]} quizData - The quiz data containing the questions.
 * @param {React.Dispatch<React.SetStateAction<QuestionData[]>>} setQuizData - The function to update the quiz data.
 * @return {QuestionData | undefined} The randomly selected question, or undefined if no question is available.
 */
function SelectRandomQuestion(
  quizData: QuestionData[],
  setQuizData: React.Dispatch<React.SetStateAction<QuestionData[] | null>>,
): QuestionData | undefined {
  // Check if quiz data exists and has questions
  if (!quizData) {
    return;
  }
  console.log("Selecting Question", quizData);

  // Select a random index from the length of questions array
  const randomIndex = Math.floor(Math.random() * quizData.length);

  // Get the question at the selected index
  const question = quizData[randomIndex];

  // Create a new quiz data object by filtering out the selected question
  const updatedQuizData = quizData.filter((_, index) => index !== randomIndex);

  // Update the quiz data
  setQuizData(updatedQuizData);

  // Return the selected question
  return question;
}

/**
 * Renders the multiple choice view for a given question.
 *
 * @param {QuestionData | null} question - The question to render.
 * @param {string} selected - The currently selected option.
 * @param {React.Dispatch<React.SetStateAction<string>>} setSelected - The function to update the selected option.
 * @param {string[]} options - The available options.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} setOptions - The function to update the available options.
 * @param {boolean[]} correct - The array indicating whether each option is correct or not.
 * @param {React.Dispatch<React.SetStateAction<boolean[]>>} setCorrect - The function to update the correct array.
 * @return {JSX.Element} The multiple choice view.
 */
function MultipleChoiceView(
  question: QuestionData | null,
  selected: string,
  setSelected: React.Dispatch<React.SetStateAction<string>>,
  options: string[],
  setOptions: React.Dispatch<React.SetStateAction<string[]>>,
  correct: boolean[],
  setCorrect: React.Dispatch<React.SetStateAction<boolean[]>>,
): JSX.Element {
  // Render a message if no question is available
  if (!question) {
    return <div>No Question</div>;
  }

  // Generate options if none are available
  if (options.length === 0) {
    setOptions(
      shuffleArray([
        ...shuffleArray(question.options).slice(0, 3),
        question.answer,
      ]),
    );
  }

  const handleClick = (option: string) => {
    // Update the selected option and correctness if none is selected
    if (selected === "") {
      setCorrect([...correct, option === question.answer]);
      setSelected(option);
    }
  };

  // Render the multiple choice view
  return (
    <div className="flex flex-col">
      {options.map((option) => {
        // Determine the background color based on the selected option and correctness
        let bg = "bg-white border-l_blue border-2";
        if (selected === "") {
          bg += " hover:bg-lime-300";
        } else if (selected === option) {
          if (option === question.answer) {
            bg = "bg-lime-300 border-sky-500 border-4";
          } else {
            bg = bg.replace(/bg-[\w-]+/g, "bg-red-400");
          }
        } else {
          if (option === question.answer) {
            bg = bg.replace(
              /bg-[\w-]+/g,
              "bg-lime-300 border-2 border-red-500",
            );
          }
        }
        console.log(bg);
        let sanitizedOption = DOMPurify.sanitize(option);
        let text = "Your pick";
        if (selected === option && selected === question.answer) {
          text = "Correct!";
        } else if (option === question.answer) {
          text = "This is the correct answer!";
        } else if (selected !== option) {
          text = "";
        }
        // Render the button for each option
        return (
          <button
            onClick={() => {
              handleClick(option);
            }}
            type="button"
            key={option}
            className={`${bg} p-5 mx-auto w-[80%] text-lg rounded-lg my-2 break-words text-left`}
          >
            {option} {selected && <span className="text-xl p-2">{text}</span>}{" "}
            {/*sanitizedOption*/}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Component for playing a quiz.
 * @returns {JSX.Element} The Quiz page.
 */
export default function QuizPage(): JSX.Element {
  // State variables for the quiz data, current question, and user selections
  const [quizData, setQuizData] = useState<QuestionData[] | null>(null);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [correct, setCorrect] = useState<boolean[]>([]);
  const params = useSearchParams();
  const [errors, setErrors] = useState<string[]>([]);
  const quizzes_id = params.get("id");
  const count = params.get("count");
  if (!quizzes_id || !count) {
    throw new Error("Invalid query parameter 'q'");
  }

  /**
   * Fetches quiz data and updates the state variables.
   */
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          `/api/questionsById?quizzes_id=${quizzes_id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = (await response.json()).rows;
        if (data.length === 0) {
          setErrors(["No questions found for this quiz"]);
          return;
        }

        const questionCount = +params.get("count")!;
        let questions = shuffleArray(data).slice(
          0,
          questionCount,
        ) as QuestionData[];

        const question = SelectRandomQuestion(questions, setQuizData);

        if (question) {
          console.log(questions);
          setQuestion(question);
        }
      } catch (error: any) {
        console.error(error);
        setErrors([error.toString()]);
      }
    }
    load();
  }, [quizzes_id, count, params]);

  // If there are errors, show them
  if (errors.length > 0) {
    return <Messages messages={errors} />;
  }

  // If the quiz data is not loaded, show a loading message
  if (!quizData) return <div>Loading...</div>;
  if (quizData.length === 0 && !question) return <div>No Questions</div>;
  /**
   * Handles the click event on the "Next" button.
   * Updates the state variables and navigates to the finished page if the quiz is finished.
   */
  const handleNextClick = () => {
    if (selected !== "") {
      const question = SelectRandomQuestion(quizData, setQuizData);
      if (question) {
        setSelected("");
        setOptions([]);
        setQuestion(question);
      } else {
        console.log("finished");
        const correctCount = correct.filter((x) => x).length;
        window.location.assign(
          `/quiz/finished?id=${quizzes_id}}&count=${correct.length}&correct=${correctCount}`,
        );
      }
    }
  };

  let hover =
    selected !== ""
      ? "hover:border-l_orange border-2 border-l_blue hover:bg-blue-500"
      : "";
  return (
    <main className="flex flex-col w-[80%] max-w-[800px] border-d_blue border-2 rounded-lg mx-auto my-2 overflow-hidden">
      <div className="h-[20px] w-full bg-black">
        <div id="progressBar" className={"h-full bg-blue-400"}></div>
      </div>
      <h2 className="text-2xl text-center p-2 m-2">{question!.question}</h2>
      {/* Render the multiple choice view */}
      {MultipleChoiceView(
        question,
        selected,
        setSelected,
        options,
        setOptions,
        correct,
        setCorrect,
      )}
      <button
        className={`rounded-md bg-blue-400 p-2 text-md w-[30%] mx-[68%] my-[2%] ${hover}`}
        type="button"
        onClick={handleNextClick}
      >
        Next
      </button>
    </main>
  );
}
