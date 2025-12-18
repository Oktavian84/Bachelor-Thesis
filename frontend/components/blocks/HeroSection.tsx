import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps } from "@/types";

export function HeroSection({
  heading,
  image,
  description,
}: Readonly<HeroSectionProps>) {

  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden rounded-b-[10rem] shadow-lg shadow-amber-100/50 pt-24 -mt-10 mb-30" style={{ scrollSnapAlign: 'none' }}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full rounded-b-[5rem] overflow-hidden">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          className="object-cover opacity-[.25]"
          fill
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-[75vh] flex items-center justify-center py-32">
        <div className="container mx-auto px-8 w-full">
          <div className="grid grid-cols-2 gap-10 items-center">
            {/* Left side - Title */}
            <div className="flex items-center justify-center">
              <h1 className="text-white text-9xl font-bold text-shadow-lg/30">
                {heading}
              </h1>
            </div>

            {/* Right side - Description */}
            <div className="flex items-center justify-center">
              <p className="text-white text-4xl leading-relaxed whitespace-pre-line max-w-md text-center text-shadow-lg/30">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
