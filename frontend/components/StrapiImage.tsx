import Image from "next/image";

interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: string | number | boolean | undefined;
}

export function StrapiImage({src, alt, className, ...rest} : Readonly<StrapiImageProps>) {
  if (!src) return null;
  return <Image src={src} alt={alt} className={className} {...rest} />;
}