import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps } from "@/types";

export function HeroSection({
  cta,
  heading,
  image,
  description,
  reversed = false,
}: Readonly<HeroSectionProps>) {
  if (reversed) {
    return (
      <section className="w-full">
        {/* Text ovanför bilden */}
        <div className="bg-black py-6">
          <div className="container mx-auto px-8">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h1 className="text-white text-7xl font-bold">{heading}</h1>
                {cta && (
                  <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-2xl hover:bg-gray-200 transition-colors whitespace-nowrap">
                    <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
                      {cta.text}
                    </Link>
                  </button>
                )}
              </div>
              {description && (
                <p className="text-rose-300 text-4xl leading-relaxed whitespace-pre-line max-w-md text-center">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bild under texten */}
        <section className="relative w-full min-h-[75vh] overflow-hidden rounded-t-[10rem] shadow-lg shadow-white/30">
          <div className="absolute inset-0 w-full h-full rounded-t-[5rem] overflow-hidden">
            <StrapiImage
              src={image.url}
              alt={image.alternativeText || "No alternative text provided"}
              className="object-cover"
              fill
            />
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden rounded-b-[10rem] shadow-lg shadow-rose-300/50">
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
      <div className="relative z-10 min-h-[90vh] flex items-center justify-center py-32">
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
