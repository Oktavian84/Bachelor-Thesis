'use client';

import ReactMarkdown from "react-markdown";
import { useScrollSnap } from "@/contexts/ScrollSnapContext";
import type { InfoBlockProps } from "@/types";

interface InfoBlockComponentProps extends InfoBlockProps {
  isFirstBlock?: boolean;
  isReversed?: boolean;
}

export function InfoBlock({
  headline,
  content,
  isFirstBlock = false,
  isReversed = false,
}: Readonly<InfoBlockComponentProps>) {
  const blockId = `info-block-${headline?.replace(/\s+/g, '-').toLowerCase() || 'default'}`;
  const { hasSnapped } = useScrollSnap();
  const opacity = isFirstBlock ? (hasSnapped ? 1 : 0) : 1;
  
  return (
    <section 
      id={blockId} 
      className="w-full min-h-[90vh] bg-black flex flex-col md:flex-row items-center relative"
    >
      <div 
        className={`w-full xl:w-[45%] min-h-[90vh] flex items-center transition-opacity duration-1000 ease-in-out ${
          isReversed ? 'xl:ml-auto' : ''
        }`}
        style={{ opacity }}
      >
        <div className={`bg-white p-8 md:p-15 min-h-[60vh] flex items-center w-[90%] xl:w-auto ${
          isReversed 
            ? 'rounded-tl-[8rem] rounded-bl-[8rem] ml-auto mr-0 xl:ml-auto' 
            : 'rounded-tr-[8rem] rounded-br-[8rem] ml-0'
        }`}>
          <div>
            <h2 className="font-lugrasimo text-black text-center text-2xl md:text-3xl font-bold mb-4">
              {headline}
            </h2>
            <div className="font-caudex text-black text-base md:text-lg leading-relaxed">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}