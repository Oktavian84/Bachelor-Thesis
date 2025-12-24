"use client";

import ReactMarkdown from "react-markdown";
import type { AboutBlockProps } from "@/types";

export function AboutBlock({
  headline,
  content,
  reversed = false,
}: Readonly<AboutBlockProps>) {
  return (
    <div
      className={`flex items-center mt-34 bg-white dark:bg-black ${
        reversed ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`w-[95%] md:w-[80%] min-h-[30vh] p-10 bg-black dark:bg-white ${
          reversed
            ? "rounded-tl-[8rem] rounded-bl-[8rem] pl-20 mb-20 xl:mb-0"
            : "rounded-tr-[8rem] rounded-br-[8rem]"
        }`}
      >
        <h2 className="font-caudex text-center text-2xl md:text-3xl font-bold mb-4 text-white dark:text-black">
          {headline}
        </h2>

        <div className="font-caudex text-base md:text-lg leading-relaxed md:px-14 text-white dark:text-black">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
