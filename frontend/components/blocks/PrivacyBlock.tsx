"use client";

import ReactMarkdown from "react-markdown";
import type { PrivacyBlockProps } from "@/types";

export function PrivacyBlock({
  headline,
  content,
  reversed,
}: Readonly<PrivacyBlockProps>) {
  return (
    <div
      className={[
        "min-h-[35vh] xl:w-full flex items-center mt-30 xl:mt-20 px-4 xl:px-8",
        "bg-white text-black dark:bg-black dark:text-white",
        reversed ? "justify-end" : "justify-start",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "min-h-[35vh] px-10 xl:px-20 py-17 xl:py-20 text-center",
          "bg-black text-white dark:bg-white dark:text-black",
          reversed
            ? "rounded-tl-[8rem] rounded-bl-4xl rounded-tr-[8rem] rounded-br-4xl mb-20 xl:mb-0"
            : "rounded-br-[8rem] rounded-bl-[8rem] rounded-tl-4xl rounded-tr-4xl",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {headline && (
          <h2 className="font-caudex text-2xl md:text-3xl font-bold mb-4">
            {headline}
          </h2>
        )}

        <div className="font-caudex text-base md:text-lg leading-relaxed text-left">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
