import ReactMarkdown from "react-markdown";

import type { AboutBlockProps } from "@/types";

export function AboutBlock({
  headline,
  content,
  reversed = false,
}: Readonly<AboutBlockProps>) {
  return (
    <div className={`flex items-center bg-black mt-34 ${reversed ? 'justify-end' : 'justify-start'}`}>
      <div className={`w-[80%] min-h-[30vh] bg-white p-8 ${
        reversed
          ? 'rounded-tl-[8rem] rounded-bl-[8rem]'
          : 'rounded-tr-[8rem] rounded-br-[8rem]'
      }`}>
        <h2 className="text-black text-center text-2xl md:text-3xl font-bold mb-4">
          {headline}
        </h2>
        <div className="text-black text-base md:text-lg leading-relaxed px-14">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

