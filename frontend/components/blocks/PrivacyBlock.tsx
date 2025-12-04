import ReactMarkdown from "react-markdown";

import type { PrivacyBlockProps } from "@/types";

export function PrivacyBlock({
  headline,
  content,
  reversed = false,
}: Readonly<PrivacyBlockProps>) {
  return (
    <div className={`min-h-[35vh] w-full flex items-center bg-black mt-25 px-8 ${reversed ? 'justify-end' : 'justify-start'}`}>
      <div className={` min-h-[35vh] bg-white p-20 text-center ${
        reversed
          ? 'rounded-tl-[8rem] rounded-tr-[8rem]'
          : 'rounded-br-[8rem] rounded-bl-[8rem]'
      }`}>
        {headline && (
          <h2 className="text-black text-2xl md:text-3xl font-bold mb-4">
            {headline}
          </h2>
        )}
        <div className="text-black text-base md:text-lg leading-relaxed text-left">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

