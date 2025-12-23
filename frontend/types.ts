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

type ComponentType = "blocks.hero-section" | "blocks.info-block" | "blocks.about-block" | "blocks.privacy-block" | "blocks.faq-block" | "blocks.contact-block" | "blocks.exhibition-block" | "blocks.gallery-block";

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

export type Block = HeroSectionProps | InfoBlockProps | AboutBlockProps | PrivacyBlockProps | FaqBlockProps | ContactBlockProps | ExhibitionBlockProps | GalleryBlockProps;

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

export interface PrivacyBlockProps extends Base<"blocks.privacy-block"> {
  reversed?: boolean;
  headline: string;
  content: string;
}

export interface FaqBlockProps extends Base<"blocks.faq-block"> {
  reversed?: boolean;
  headline: string;
  content: string;
}

export interface ContactBlockProps extends Base<"blocks.contact-block"> {
  headline: string;
  content: string;
  image: ImageProps;
  buttonText: string;
  cta?: LinkProps[];
}

export interface Exhibition {
  id: number;
  documentId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  image: ImageProps;
  slug: string;
  isActive: boolean;
}

export interface ExhibitionBlockProps extends Base<"blocks.exhibition-block"> {
  exhibition: Exhibition;
}

export interface GalleryItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  image: ImageProps;
  price: number;
  slug: string;
  Dimensions?: string;
}

export interface GalleryBlockProps extends Base<"blocks.gallery-block"> {
  gallery_items: GalleryItem[];
}

export interface CartItem {
  id: number;
  documentId: string;
  title: string;
  image: ImageProps;
  price: number;
  slug: string;
}