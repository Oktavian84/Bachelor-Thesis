import ReactMarkdown from "react-markdown";

import type { InfoBlockProps } from "@/types";

export function InfoBlock({
  headline,
  content,
  reversed = false,
}: Readonly<InfoBlockProps>) {
  const blockId = `info-block-${headline?.replace(/\s+/g, '-').toLowerCase() || 'default'}`;
  
  return (
    <section id={blockId} className="w-full min-h-[90vh] bg-black flex items-center pt-30 pb-30 relative">
      <div className={`w-[45%] min-h-[90vh] flex items-center ${reversed ? 'ml-auto' : ''}`}>
        <div className={`bg-white p-8 md:p-15 min-h-[60vh] flex items-center ${
          reversed 
            ? 'rounded-tl-[8rem] rounded-bl-[8rem]' 
            : 'rounded-tr-[8rem] rounded-br-[8rem]'
        }`}>
          <div>
            <h2 className="text-black text-center text-2xl md:text-3xl font-bold mb-4">
              {headline}
            </h2>
            <div className="text-black text-base md:text-lg leading-relaxed">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}