"use client";
import { useState } from "react";
import { StrapiImage } from "../StrapiImage";
import type { GalleryBlockProps } from "@/types";

export function GalleryBlock({
  gallery_items,
}: Readonly<GalleryBlockProps>) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!gallery_items || gallery_items.length === 0) {
    return (
      <section className="w-full bg-black flex items-center justify-center py-24">
        <p className="text-white text-2xl">No gallery items found</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-black py-24">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gallery_items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item.id)}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <StrapiImage
                src={item.image.url}
                alt={item.image.alternativeText || item.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

