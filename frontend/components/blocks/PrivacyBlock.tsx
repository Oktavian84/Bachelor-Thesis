"use client";

import ReactMarkdown from "react-markdown";
import { useTheme } from "@/contexts/ThemeContext";
import type { PrivacyBlockProps } from "@/types";

export function PrivacyBlock({
  headline,
  content,
  reversed,
}: Readonly<PrivacyBlockProps>) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`min-h-[35vh] xl:w-full flex items-center mt-30 xl:mt-20 px-4 xl:px-8 ${isLight ? 'bg-white' : 'bg-black'} ${reversed ? 'justify-end' : 'justify-start'}`}>
      <div className={`min-h-[35vh] px-10 xl:px-20 py-17 xl:py-20 text-center ${
        isLight ? 'bg-black' : 'bg-white'
      } ${
        reversed
          ? 'rounded-tl-[8rem] rounded-bl-4xl rounded-tr-[8rem] rounded-br-4xl mb-20 xl:mb-0'
          : 'rounded-br-[8rem] rounded-bl-[8rem] rounded-tl-4xl rounded-tr-4xl'
      }`}>
        {headline && (
          <h2 className={`font-caudex text-2xl md:text-3xl font-bold mb-4 ${isLight ? 'text-white' : 'text-black'}`}>
            {headline}
          </h2>
        )}
        <div className={`font-caudex text-base md:text-lg leading-relaxed text-left ${isLight ? 'text-white' : 'text-black'}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

