import ReactMarkdown from "react-markdown";

import type { FaqBlockProps } from "@/types";

export function FaqBlock({
  headline,
  content,
  reversed,
}: Readonly<FaqBlockProps>) {

  
  return (
    <div
      className={`w-[30%] min-h-[65vh] bg-white p-16 mt-3 ${
        reversed
          ? "rounded-tl-[8rem] rounded-tr-[8rem] rounded-bl-2xl rounded-br-2xl mt-35"
          : "rounded-br-[8rem] rounded-bl-[8rem] rounded-tl-2xl rounded-tr-2xl"
      }`}
    >
      {headline && (
        <h2 className="text-black text-2xl md:text-3xl font-bold mb-4 text-center">
          {headline}
        </h2>
      )}
      <div className="text-black md:text-lg leading-relaxed text-left">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
