import { getStrapiURL } from "./get-strapi-url";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (src.startsWith("http") || src.startsWith("//")) {
    return src;
  }
  
  const baseUrl = getStrapiURL();
  return `${baseUrl}${src}`;
}

