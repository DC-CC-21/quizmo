import CountQuestionsById from "../lib/CountQuestionsById";
import QuizData from "../lib/QuizData";

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
}: {
  quizData: QuizData;
  editMode?: boolean;
}): JSX.Element {
  // Determine the path for the link based on whether edit mode is enabled or not
  let path = `/quiz?id=${quizData.quizzes_id}`;
  if (editMode) {
    path = `/edit/${quizData.quizzes_id}`;
  }

  // Get the count of questions for the quiz
  const questionCount = CountQuestionsById(quizData.quizzes_id);

  // Render the quiz card
  return (
    // The quiz card is a link to the quiz or edit mode
    <a className="bg-l_blue p-2 rounded-lg" href={path}>
      {/* Display the quiz name */}
      <div className="text-xl p-1 mb-2 border-b-4 border-b-d_orange flex flex-row justify-between">
        <span>{quizData.quiz_name}</span>
        {/* If edit mode is enabled, display a settings icon */}
        {editMode && (
          <img src="/largeImages/gear.png" alt="Settings" className="w-8 h-8" />
        )}
      </div>
      {/* Display the number of questions in the quiz */}
      <p className="p-2 text-right">Questions: {questionCount}</p>
    </a>
  );
}

