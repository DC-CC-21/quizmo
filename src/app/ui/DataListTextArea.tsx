import { useState } from "react";

type DataListTextAreaProps = {
  dataList: string[];
  className?: string;
  value: string;
};
export default function DataListTextArea({
  dataList,
  className,
  value,
}: DataListTextAreaProps) {
  function showListOptions() {
    setShowOptions(true);
  }
  function typeText(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    let filteredOptions = dataList.filter((option) => {
      return option.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setOptions(filteredOptions);
  }
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [text, setText] = useState<string>(value);
  const [options, setOptions] = useState<string[]>([...dataList]);

  let border = "rounded-md";
  if (showOptions) {
    border = "rounded-t-md";
  }
  return (
    <div className={`relative ${className}`}>
      <textarea
        title="Question input field"
        className={`w-full h-full ${border} border border-black p-2 resize-none`}
        onClick={showListOptions}
        onChange={typeText}
        onBlur={() => {
          setTimeout(() => {
            setShowOptions(false);
          }, 100);
        }}
        value={text}
      />
      {showOptions && (
        <div
          className={`flex flex-col bg-white z-20 absolute
        w-full h-[100px] translate-y-[100%] bottom-0 left-0
        overflow-y-scroll border border-t-0 border-black rounded-b-md`}
        >
          {options.map((option, index) => (
            <button
              onClick={() => {
                setText(option);
                setShowOptions(false);
              }}
              key={index}
              type="button"
              className="hover:bg-lime-300 text-left p-1 w-full"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
