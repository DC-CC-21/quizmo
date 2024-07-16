import { Dispatch, MouseEventHandler, useState } from "react";
import QuizData, { QuestionData } from "../lib/QuizData";
import VerticalSlideButton from "./VerticalSlideButton";
import DataListTextArea from "./DataListTextArea";
import SlideButton from "./SlideButton";

/**
 * Component to update the question data.
 *
 * @param {Object} props - The properties for the component.
 * @param {number} props.currentQuestionIndex - The index of the current question.
 * @param {Dispatch<QuestionData[]>} props.setData - The function to update the question data.
 * @param {QuestionData[]} props.data - The question data.
 * @return {JSX.Element} The QuestionUpdate component.
 */
export default function QuestionUpdate({
  currentQuestionIndex,
  setData,
  data,
}: {
  /**
   * The index of the current question.
   */
  currentQuestionIndex: number;
  setData: Dispatch<QuestionData[]>;
  data: QuestionData[];
}): JSX.Element {
  /**
   * Handles option operations (addition or deletion) for a given question.
   *
   * @param {string} type - The type of operation to perform. Should be either "Add" or "Delete".
   * @param {number} [index=0] - The index of the option to delete. Defaults to 0.
   */
  function OptionHandler(type: string, index: number = 0) {
    // Create a copy of the questions array
    const questionData: QuestionData[] = [...(data || [])];

    // Check if there is a current question
    if (!currentQuestion) return;
    setChanges(changes + 1);
    // Perform the operation based on the type
    switch (type) {
      case "Add":
        // Add a new option to the current question
        questionData[currentQuestionIndex].options.push(
          "New Option"
        );
        break;
      case "Delete":
        // Delete an option from the current question at the specified index
        questionData[currentQuestionIndex].options.splice(
          index,
          1
        );
        break;
    }

    // Update the data state with the modified question data
    setData(questionData);
  }

  /**
   * Updates the current question with the values from the UI.
   */
  function UpdateQuestionHandler() {
    // Create a copy of the questions array
    const questionData: QuestionData[] = [...(data || [])];

    // Get the name and answer input elements
    const name = document.getElementById(
      "name"
    ) as HTMLInputElement;
    const answer = document.getElementById(
      "answer"
    ) as HTMLInputElement;

    // Get all the list option input elements
    let listOptionElements = Array.from(
      document.querySelectorAll(".listOption textarea")
    );

    // Get the values of all the list option input elements
    let listOptions = listOptionElements.map((element) => {
      return (element as HTMLInputElement).value;
    });

    // Update the current question with the new values
    questionData[currentQuestionIndex].question = name?.value;
    questionData[currentQuestionIndex].answer = answer?.value;
    questionData[currentQuestionIndex].options = listOptions;

    // Update the data state
    setData(questionData);
    setChanges(0);
  }

  /**
   * Handles the event when the user leaves an input field
   * @param {Event} e - The event object
   */
  function inputLeaveHandler(e: any) {
    // Get the input element that triggered the event
    let element = e.target as HTMLInputElement;

    // Get the original value and the current value of the input element
    let dataValue = element.dataset.value || "";
    let originalValue = element.dataset.originalvalue || "";

    // Check if the input value is different from the original value
    if (element.value != dataValue) {
      // If the input value is the same as the original value, decrease the changes count
      if (element.value == originalValue) {
        setChanges(changes - 1);
      } else {
        // Otherwise, increase the changes count
        setChanges(changes + 1);
      }

      // Update the data-value attribute with the current value
      element.setAttribute("data-value", element.value);
    }
  }

  // Get the current question and all the options
  const currentQuestion = data[currentQuestionIndex];
  let allOptions: Array<string> = [];
  const quizTypeOptions = [
    "Multiple Choice",
    "Fill in the Blank",
    "Both",
  ];

  // State variables
  const [changes, setChanges] = useState<number>(0);

  data.forEach((question: QuestionData) => {
    if (question.options.length) {
      allOptions.push(...question.options);
    }
    allOptions.push(question.answer);
    allOptions.push(question.question);
  });
  // console.log(allOptions);

  // Question data
  return (
    <div id="questionData">
      {/* Question name */}
      <label htmlFor="name">
        Question Name:
        <input
          type="text"
          name="name"
          id="name"
          key={currentQuestion?.question}
          defaultValue={currentQuestion?.question}
          data-value={currentQuestion?.question}
          data-originalvalue={currentQuestion?.question}
          onMouseLeave={inputLeaveHandler}
        />
      </label>

      {/* Answer */}
      <label>
        Answer:
        <input
          id="answer"
          type="text"
          key={currentQuestion?.answer}
          defaultValue={currentQuestion?.answer}
          data-value={currentQuestion?.answer}
          data-originalvalue={currentQuestion?.answer}
          onMouseLeave={inputLeaveHandler}
        />
      </label>

      {/* Options */}
      <div>
        <datalist id={"allOptions"}>
          {allOptions.map((listOption, index) => {
            return (
              <option key={`${listOption}-${index}`}>
                {listOption}
              </option>
            );
          })}
        </datalist>
        <p>Options:</p>
        <ul className="border-2 border-d_blue rounded-md border-dashed">
          {/* Buttons to add an option */}
          <li>
            {/* Buttons to add an option */}
            <button
              type="button"
              onClick={() => {
                OptionHandler("Add");
              }}
              className="w-[80%] mx-auto block p-2 rounded-xl border border-white bg-lime-400 m-2"
            >
              Add Option
            </button>
          </li>

          {/* List of Options: */}
          {currentQuestion?.options.map((option, index) => {
            return (
              <li
                // Option list item
                key={index}
                className="listOption bg-white border-d_blue grid grid-cols-[1fr,50px] gap-2 p-2 rounded-md m-2"
              >
                {/* <label htmlFor={option}> */}
                {/* <input
                    key={currentQuestion.questions_id}
                    list={"allOptions"}
                    name={option}
                    id={option}
                    defaultValue={option}
                    aria-label="Question"
                    className="w-full h-full text-wrap"
                  /> */}
                {/* </label> */}
                <DataListTextArea
                  dataList={allOptions}
                  className="w-full h-full"
                  value={option}
                />

                {/* <VerticalSlideButton
                  btnNames={quizTypeOptions}
                  className="hidden sm:block"
                />
                <SlideButton btnNames={quizTypeOptions} defaultValue={} */}
                <button
                  type="button"
                  onClick={() => {
                    OptionHandler("Delete", index);
                  }}
                  className={`mx-auto my-0 w-full h-[50px] 
                    relative hover:text-white
                    [&>div]:hover:w-2/3  [&>div]:hover:h-2/3`}
                >
                  <div
                    className={`absolute left-1/2 top-1/2 
                    translate-x-[-50%] translate-y-[-50%]
                    w-0 h-0 bg-red-600 rounded-full z-0
                    transition-all duration-200`}
                  ></div>
                  <span className=" transition-all duration-300 z-0 relative block">
                    X
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Update button */}
      <button
        onClick={UpdateQuestionHandler}
        type="button"
        className="overflow-visible relative hover:bg-blue-500 col-span-2 m-2 rounded-full bg-l_blue text-white text-center p-2 w-2/3 mx-auto block"
      >
        {changes !== 0 && (
          <>
            <div className="animate-[ping_1.5s_ease-in-out_infinite] absolute right-0 top-0 rounded-full bg-lime-300 border-[1px] border-sky-400 w-[20px] h-[20px]"></div>
            <div className="absolute right-0 top-0 rounded-full bg-lime-300 border-[1px] border-sky-400 w-[20px] h-[20px] text-sm text-black">
              {changes}
            </div>
          </>
        )}
        Update Changes
      </button>
    </div>
  );
}
