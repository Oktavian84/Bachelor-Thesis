export interface LinkProps {
  id: number;
  text: string;
  href: string;
  isExternal: boolean;
}

export interface ImageProps {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
}

export interface LogoProps {
  logoText: string;
  image: ImageProps;
}

type ComponentType = "blocks.hero-section" | "blocks.info-block" | "blocks.about-block";

interface Base<
  T extends ComponentType,
  D extends object = Record<string, unknown>
> {
  id: number;
  __component?: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export type Block = HeroSectionProps | InfoBlockProps | AboutBlockProps;

export interface HeroSectionProps extends Base<"blocks.hero-section"> {
  heading: string;
  image: ImageProps;
  description?: string;
  reversed?: boolean;
  cta?: LinkProps;
}

export interface InfoBlockProps extends Base<"blocks.info-block"> {
  reversed?: boolean;
  headline: string;
  content: string;
  image: ImageProps;
}

export interface AboutBlockProps extends Base<"blocks.about-block"> {
  reversed?: boolean;
  headline: string;
  content: string;
}