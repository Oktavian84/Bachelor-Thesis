import Image from "next/image";
import { getStrapiURL } from "@/utils/get-strapi-url";

interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  unoptimized?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export function StrapiImage({src, alt, className, unoptimized = true, ...rest} : Readonly<StrapiImageProps>) {
  if (!src) return null;

  const imageSrc = src.startsWith("http") || src.startsWith("//") 
    ? src 
    : `${getStrapiURL()}${src}`;
  
  return <Image src={imageSrc} alt={alt} className={className} unoptimized={unoptimized} {...rest} />;
}