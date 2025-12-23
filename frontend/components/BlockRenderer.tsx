'use client';

import type { Block, FaqBlockProps, GalleryBlockProps, InfoBlockProps } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

import { HeroSection } from "@/components/blocks/HeroSection";
import { InfoBlock } from "@/components/blocks/InfoBlock";
import { AboutBlock } from "@/components/blocks/AboutBlock";
import { PrivacyBlock } from "@/components/blocks/PrivacyBlock";
import { FaqBlock } from "@/components/blocks/FaqBlock";
import { ContactBlock } from "@/components/blocks/ContactBlock";
import { ExhibitionBlock } from "@/components/blocks/ExhibitionBlock";
import { GalleryBlock } from "@/components/blocks/GalleryBlock";
import { SculptureTransition } from "@/components/SculptureTransition";
import { ScrollSnapHandler } from "@/components/ScrollSnapHandler";

function blockRenderer(block: Block, index: number, allBlocks: Block[], isLight: boolean) {
  switch (block.__component) {
    case "blocks.hero-section":
      return <HeroSection {...block} key={index} />;
    case "blocks.info-block":
      const infoBlock = block as InfoBlockProps;
      const nextBlock = allBlocks[index + 1];
      const isFirstInfoBlock = index === 0 || allBlocks[index - 1]?.__component !== "blocks.info-block";
      const isSecondInfoBlock = nextBlock?.__component === "blocks.info-block" && isFirstInfoBlock;
      
      let infoBlockCount = 0;
      for (let i = 0; i <= index; i++) {
        if (allBlocks[i]?.__component === "blocks.info-block") {
          infoBlockCount++;
        }
      }
      const isBlock2 = infoBlockCount === 2;
      
      const firstBlockId = `info-block-${infoBlock.headline?.replace(/\s+/g, '-').toLowerCase() || 'default'}`;
      const secondBlockId = isSecondInfoBlock 
        ? `info-block-${(nextBlock as InfoBlockProps).headline?.replace(/\s+/g, '-').toLowerCase() || 'default'}` 
        : '';
      
      return (
        <div key={index}>
          <InfoBlock {...infoBlock} isFirstBlock={isFirstInfoBlock} isReversed={isBlock2} />
          {isFirstInfoBlock && (
            <>
              <ScrollSnapHandler firstInfoBlockId={firstBlockId} />
              {isSecondInfoBlock && (
                <SculptureTransition 
                  firstBlockId={firstBlockId}
                  secondBlockId={secondBlockId}
                />
              )}
            </>
          )}
        </div>
      );
    case "blocks.about-block":
      return <AboutBlock {...block} key={index} />;
    case "blocks.privacy-block":
      return <PrivacyBlock {...block} key={index} />;
    case "blocks.faq-block":
      if (index > 0 && allBlocks[index - 1].__component === "blocks.faq-block") return null;
      const faqBlocks = allBlocks.slice(index).filter(b => b.__component === "blocks.faq-block") as FaqBlockProps[];
      return (
        <div key={index} className={`w-full py-8 mt-15 flex flex-col xl:flex-row items-start justify-evenly px-8 min-h-[75vh] gap-20 ${isLight ? 'bg-white' : 'bg-black'}`}>
          {faqBlocks.map((b, i) => <FaqBlock key={i} {...b} />)}
        </div>
      );
    case "blocks.contact-block":
      return <ContactBlock {...block} key={index} />;
    case "blocks.exhibition-block":
      return <ExhibitionBlock {...block} key={index} />;
    case "blocks.gallery-block":
      if (index > 0 && allBlocks[index - 1].__component === "blocks.gallery-block") return null;
      const galleryBlocks = allBlocks.slice(index).filter(b => b.__component === "blocks.gallery-block") as GalleryBlockProps[];
      const allGalleryItems = galleryBlocks.flatMap(b => b.gallery_items || []);
      return (
        <GalleryBlock 
          key={index} 
          {...galleryBlocks[0]} 
          gallery_items={allGalleryItems}
        />
      );
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  return blocks.map((block, index) => blockRenderer(block, index, blocks, isLight));
}