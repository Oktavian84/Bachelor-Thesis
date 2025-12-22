"use client";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StrapiImage } from "../StrapiImage";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
  };
}

export function Header({ data }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { getItemCount } = useCart();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.setAttribute('data-menu-open', 'true');
    } else {
      document.body.removeAttribute('data-menu-open');
    }
  }, [isMenuOpen]);

  if (!data) return null;

  const { logo, navigation } = data;
  const cartItemCount = getItemCount();
  return (
    <header className={`absolute top-0 left-0 right-0 z-60 px-8 py-4 ${isMenuOpen ? 'bg-black rounded-b-[5rem] md:rounded-b-[10rem] overflow-hidden border-b-2 border-white' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || "No alternative text provided"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={item.href}
                    target={item.isExternal ? "_blank" : "_self"}
                    className={`text-xl transition-all duration-300 relative group pb-1 px-3 py-1 rounded-tr-[8rem] rounded-tl-[8rem] rounded-br-[8rem] rounded-bl-[8rem] ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white hover:bg-white/40 hover:text-white"
                    }`}
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/checkout"
                className="relative text-white hover:opacity-80 transition-opacity"
                aria-label="Shopping cart"
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
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
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
          <Link
            href="/checkout"
            className="relative text-white hover:opacity-80 transition-opacity"
            aria-label="Shopping cart"
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
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden mt-4 pb-4">
          <ul className="flex flex-col gap-6 items-center">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={item.href}
                    target={item.isExternal ? "_blank" : "_self"}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-xl transition-all duration-300 relative group pb-1 px-3 py-1 rounded ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white hover:opacity-80"
                    }`}
                  >
                    {item.text}
                    {!isActive && (
                      <span
                        className="absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}