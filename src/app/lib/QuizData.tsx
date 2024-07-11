/**
 * Interface representing a question in a quiz.
 * @property {string} question - The question text.
 * @property {string} answer - The correct answer.
 * @property {Array<string>} options - The available options for the question.
 */
export interface QuestionData {
  questions_id: string;
  question: string;
  answer: string;
  types: string,
  quizzes_id: string;
  options: string[]
  isNew?: boolean
}


/**
 * Interface representing a quiz in the database.
 * @property {string} quizzes_id - The ID of the quiz.
 * @property {string} users_id - The ID of the user who created the quiz.
 * @property {number} public - Whether the quiz is publicly accessible (0 for private, 1 for public).
 * @property {string} quiz_name - The name of the quiz.
 */
export default interface QuizData {
  // The ID of the quiz.
  quizzes_id: string;
  // The ID of the user who created the quiz.
  users_id: string;
  // Whether the quiz is publicly accessible (0 for private, 1 for public).
  public:number;
  // The name of the quiz.
  quiz_name: string;
}

