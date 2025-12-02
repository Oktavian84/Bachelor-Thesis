import { getStrapiURL } from "./get-strapi-url";

export default function imageLoader({ 
  src, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  width, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  quality 
}: { 
  src: string; 
  width: number; 
  quality?: number;
}) {
  
  if (src.startsWith("http") || src.startsWith("//")) {
    return src;
  }

  const baseUrl = getStrapiURL();
  const url = `${baseUrl}${src}`;

  return url;
}

