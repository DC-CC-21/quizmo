import clsx from "clsx";
import QuizCard from "./ui/QuizCard";
import GetAvaliableQuizzes from "./lib/GetAvailableQuizzes";
import QuizData from "./lib/QuizData";

/**
 * Renders the home page of the application.
 * @returns {Promise<JSX.Element>} The home page component.
 */
export default async function Home(): Promise<JSX.Element> {
  // Fetch available quizzes from the server
  const data = await GetAvaliableQuizzes();

  // Render a grid of quiz cards
  return (
    <main
      className={clsx(
        "grid grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-3",
        "p-2 gap-2"
      )}
    >
      {/* Map over the quizzes and render a QuizCard for each */}
      {data.sort((a, b) => a.quiz_name.localeCompare(b.quiz_name)).map((quizElement: QuizData) => (
        <QuizCard
          // Set a unique key for each QuizCard
          key={quizElement.quiz_name}
          // Pass the quiz data to the QuizCard component
          quizData={quizElement}
        />
      ))}
    </main>
  );
}

