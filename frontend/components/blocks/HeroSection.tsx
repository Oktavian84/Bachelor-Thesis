import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps } from "@/types";

export function HeroSection({
  heading,
  image,
  description,
}: Readonly<HeroSectionProps>) {
  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden rounded-b-[5rem] md:rounded-b-[10rem] shadow-lg shadow-amber-100/50 pt-24 -mt-10 mb-30 bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          className="object-cover opacity-[.25]"
          fill
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-[75vh] flex items-center justify-center">
        <div className="container mx-auto px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-30 items-center">
            <div className="flex items-center justify-center">
              <h1 className="font-caudex text-white text-5xl md:text-7xl lg:text-9xl font-bold text-center md:text-left text-shadow-lg/30">
                {heading}
              </h1>
            </div>

            <div className="flex items-center justify-center">
              <p className="font-caudex text-white text-xl md:text-2xl lg:text-4xl leading-relaxed whitespace-pre-line max-w-lg text-center text-shadow-lg/30">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
