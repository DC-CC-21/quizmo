"use client";

import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";

export default function VerticalSlideButton({
  btnNames,
  setValue,
  maxRows = 3,
  className = "",
  defaultValue = 0,
}: {
  btnNames: Array<string>;
  setValue?: Dispatch<SetStateAction<string>>;
  maxRows?: number;
  className?: string;
  defaultValue?: number;
}) {
  const [on, setOn] = useState(defaultValue || 0);
  const id = "SB" + btnNames.join("").replace(/[\(\)\ %]/g, "");
  const columns = 1;
  const spanWidth = 100 / columns;

  let rows = btnNames.length;
  if (rows > maxRows) {
    rows = maxRows;
  }
  let spanHeight = 100 / rows;
  if (btnNames.length < maxRows) {
    spanHeight = 100;
  }

  return (
    <>
      <style jsx>
        {`
          #${id} {
            grid-template-rows: repeat(${rows}, 1fr);
          }
          #${id} span {
            width: ${spanWidth}%;
            height: ${spanHeight}%;
            left: 0;
            top: ${spanHeight * (on % rows)}%;
          }
        `}
      </style>
      <div
        id={id}
        className={clsx(
          "gap-5 rounded-xl slideButton grid relative min-h-[50px] border-2 border-sky-700 min-w-1/2 my-2 p-2",
          className,
        )}
      >
        <span
          className={
            "transition-all duration-200 select-none absolute bg-lime-300 rounded-xl"
          }
        />
        {btnNames.map((name, index) => {
          return (
            <button
              onClick={() => {
                setOn(index);
                if (setValue) {
                  setValue(name);
                }
              }}
              type="button"
              key={`slideBtn-${index}`}
              data-col={index}
            >
              {name}
            </button>
          );
        })}
      </div>
    </>
  );
}
