import { getStrapiURL } from "./get-strapi-url";

export default function imageLoader({ src }: { src: string }) {
  if (src.startsWith("http") || src.startsWith("//")) {
    return src;
  }
  
  const baseUrl = getStrapiURL();
  return `${baseUrl}${src}`;
}

