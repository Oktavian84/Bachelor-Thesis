"use client";

import ReactMarkdown from "react-markdown";
import { useTheme } from "@/contexts/ThemeContext";
import type { FaqBlockProps } from "@/types";

export function FaqBlock({
  headline,
  content,
  reversed,
}: Readonly<FaqBlockProps>) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`w-full xl:w-[30%] min-h-[65vh] px-10 xl:px-20 py-20 mt-10 ${
        isLight ? 'bg-black' : 'bg-white'
      } ${
        reversed
          ? "rounded-tl-[8rem] rounded-tr-[8rem] rounded-bl-2xl rounded-br-2xl xl:mt-25"
          : "rounded-br-[8rem] rounded-bl-[8rem] rounded-tl-2xl rounded-tr-2xl"
      }`}
    >
      {headline && (
        <h2 className={`font-caudex text-2xl md:text-3xl font-bold mb-4 text-center ${isLight ? 'text-white' : 'text-black'}`}>
          {headline}
        </h2>
      )}
      <div className={`font-caudex md:text-lg leading-relaxed text-left ${isLight ? 'text-white' : 'text-black'}`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
