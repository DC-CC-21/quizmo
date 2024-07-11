import clsx from "clsx";
import QuizCard from "../ui/QuizCard";
import GetEditableQuizzes from "../lib/GetEditableQuizzes";
import QuizData from "../lib/QuizData";

export default async function Home() {
  const data = await GetEditableQuizzes();
  if (!data) {
    return <div>No Quizzes</div>
  }
  return (
    <main
      className={clsx(
        "grid grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-3",
        "p-2 gap-2"
      )}
    >
      {data.map((quizElement: QuizData) => (
        <QuizCard
          key={quizElement.quiz_name}
          quizData={quizElement}
          editMode={true}
        />
      ))}
    </main>
  );
}
