"use client";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { StrapiImage } from "../StrapiImage";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
  };
}

export function Header({ data }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!data) return null;

  const { logo, navigation } = data;
  return (
    <header className="absolute top-0 left-0 right-0 z-[60] bg-transparent px-8 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || "No alternative text provided"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
        
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  className="text-white text-xl hover:opacity-80 transition-opacity"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="sm:hidden mt-4">
          <ul className="flex flex-row flex-wrap gap-6 justify-center">
            {navigation.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white text-xl hover:opacity-80 transition-opacity"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}