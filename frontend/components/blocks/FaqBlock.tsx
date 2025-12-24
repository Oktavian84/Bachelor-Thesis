"use client";

import ReactMarkdown from "react-markdown";
import type { FaqBlockProps } from "@/types";

export function FaqBlock({
  headline,
  content,
  reversed,
}: Readonly<FaqBlockProps>) {
  return (
    <div
      className={[
        "w-full xl:w-[30%] min-h-[65vh] px-10 xl:px-20 py-20 mt-10",
        "bg-black text-white dark:bg-white dark:text-black",
        reversed
          ? "rounded-tl-[8rem] rounded-tr-[8rem] rounded-bl-2xl rounded-br-2xl xl:mt-25"
          : "rounded-br-[8rem] rounded-bl-[8rem] rounded-tl-2xl rounded-tr-2xl",
      ].join(" ")}
    >
      {headline && (
        <h2 className="font-caudex text-2xl md:text-3xl font-bold mb-4 text-center">
          {headline}
        </h2>
      )}

      <div className="font-caudex md:text-lg leading-relaxed text-left">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
