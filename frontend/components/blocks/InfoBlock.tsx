'use client';

import ReactMarkdown from "react-markdown";
import { useScrollSnap } from "@/contexts/ScrollSnapContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme } = useTheme();
  const opacity = isFirstBlock ? (hasSnapped ? 1 : 0) : 1;
  const isLight = theme === "light";
  
  return (
    <section 
      id={blockId} 
      className={`w-full min-h-[90vh] flex flex-col md:flex-row items-center relative ${
        isLight ? 'bg-white' : 'bg-black'
      }`}
    >
      <div 
        className={`w-full xl:w-[45%] min-h-[90vh] flex items-center transition-opacity duration-1000 ease-in-out ${
          isReversed ? 'xl:ml-auto' : ''
        }`}
        style={{ opacity }}
      >
        <div className={`px-10 md:px-15 py-8 md:py-15 min-h-[60vh] flex items-center w-[90%] xl:w-auto ${
          isLight ? 'bg-black' : 'bg-white'
        } ${
          isReversed 
            ? 'rounded-tl-[8rem] rounded-bl-[8rem] ml-8' 
            : 'rounded-tr-[8rem] rounded-br-[8rem]'
        }`}>
          <div>
            <h2 className={`font-caudex text-center text-2xl md:text-4xl font-bold mb-4 ${
              isLight ? 'text-white' : 'text-black'
            }`}>
              {headline}
            </h2>
            <div className={`font-caudex text-base md:text-xl leading-relaxed ${
              isLight ? 'text-white' : 'text-black'
            }`}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}