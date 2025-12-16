'use client';

import type { Block, FaqBlockProps, GalleryBlockProps, InfoBlockProps } from "@/types";

import { HeroSection } from "@/components/blocks/HeroSection";
import { InfoBlock } from "@/components/blocks/InfoBlock";
import { AboutBlock } from "@/components/blocks/AboutBlock";
import { PrivacyBlock } from "@/components/blocks/PrivacyBlock";
import { FaqBlock } from "@/components/blocks/FaqBlock";
import { ContactBlock } from "@/components/blocks/ContactBlock";
import { ExhibitionBlock } from "@/components/blocks/ExhibitionBlock";
import { GalleryBlock } from "@/components/blocks/GalleryBlock";
import { SculptureTransition } from "@/components/SculptureTransition";

function blockRenderer(block: Block, index: number, allBlocks: Block[]) {
  switch (block.__component) {
    case "blocks.hero-section":
      return <HeroSection {...block} key={index} />;
    case "blocks.info-block":
      const infoBlock = block as InfoBlockProps;
      const nextBlock = allBlocks[index + 1];
      const isFirstInfoBlock = index === 0 || allBlocks[index - 1]?.__component !== "blocks.info-block";
      const isSecondInfoBlock = nextBlock?.__component === "blocks.info-block" && isFirstInfoBlock;
      
      const firstBlockId = `info-block-${infoBlock.headline?.replace(/\s+/g, '-').toLowerCase() || 'default'}`;
      const secondBlockId = isSecondInfoBlock 
        ? `info-block-${(nextBlock as InfoBlockProps).headline?.replace(/\s+/g, '-').toLowerCase() || 'default'}` 
        : '';
      
      return (
        <div key={index}>
          <InfoBlock {...infoBlock} />
          {isFirstInfoBlock && isSecondInfoBlock && (
            <SculptureTransition 
              firstBlockId={firstBlockId}
              secondBlockId={secondBlockId}
            />
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
        <div key={index} className="w-full bg-black py-8 mt-15 flex items-start justify-evenly px-8 min-h-[75vh] gap-20">
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
  return blocks.map((block, index) => blockRenderer(block, index, blocks));
}