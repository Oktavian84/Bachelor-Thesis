"use client";

import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StrapiImage } from "../StrapiImage";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "../ThemeToggle";

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

  const isHomePage = pathname === "/";
  const cartItemCount = getItemCount();

  useEffect(() => {
    if (isMenuOpen) document.body.setAttribute("data-menu-open", "true");
    else document.body.removeAttribute("data-menu-open");
  }, [isMenuOpen]);

  if (!data) return null;

  const { logo, navigation } = data;

  const headerBgClass =
  isMenuOpen
    ? "bg-black border-b-2 border-white rounded-b-[5rem] md:rounded-b-[10rem] overflow-hidden"
    : !isHomePage
      ? "bg-white dark:bg-black"
      : "bg-transparent";

  const desktopLinkBase =
    "font-lugrasimo text-xl relative group pb-1 px-3 py-1 rounded-tr-[8rem] rounded-tl-[8rem] rounded-br-[8rem] rounded-bl-[8rem] transition-all duration-300";

  const desktopLinkInactiveHome =
    "text-white hover:bg-white/40 hover:text-white";

  const desktopLinkActiveHome =
    "bg-white text-black";

  const desktopLinkInactiveSub =
    "text-black hover:bg-black/10 hover:text-black dark:text-white dark:hover:bg-white/20 dark:hover:text-white";

  const desktopLinkActiveSub =
    "bg-black text-white dark:bg-white dark:text-black";

  const iconColorHome = "text-white";
  const iconColorSub = "text-black dark:text-white";

  const badgeHome = "bg-white text-black";
  const badgeSub = "bg-black text-white dark:bg-white dark:text-black";

  const mobileLinkBase =
    "font-lugrasimo text-xl relative group pb-1 px-3 py-1 rounded transition-all duration-300";

  const mobileLinkInactiveHome = "text-white hover:opacity-80";
  const mobileLinkActiveHome = "bg-white text-black";

  const mobileLinkInactiveSub = "text-black hover:opacity-80 dark:text-white";
  const mobileLinkActiveSub = "bg-black text-white dark:bg-white dark:text-black";

  const underlineHome = "bg-white";
  const underlineSub = "bg-black dark:bg-white";

  const shouldInvertToggle = !isHomePage;

  return (
    <header className={`absolute top-0 left-0 right-0 z-60 px-8 pt-6 pb-4 ${headerBgClass}`}>
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
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              const linkClass = isHomePage
                ? isActive
                  ? desktopLinkActiveHome
                  : desktopLinkInactiveHome
                : isActive
                  ? desktopLinkActiveSub
                  : desktopLinkInactiveSub;

              return (
                <li key={item.id} className="relative">
                  <Link
                    href={item.href}
                    target={item.isExternal ? "_blank" : "_self"}
                    className={`${desktopLinkBase} ${linkClass}`}
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}

            <li>
              <ThemeToggle inverted={shouldInvertToggle} />
            </li>

            <li>
              <Link
                href="/checkout"
                className={`relative hover:opacity-80 ${isHomePage ? iconColorHome : iconColorSub}`}
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
                  <span className={`absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${isHomePage ? badgeHome : badgeSub}`}>
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className={`focus:outline-none ${isHomePage ? iconColorHome : iconColorSub}`}
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
            className={`relative hover:opacity-80 ${isHomePage ? iconColorHome : iconColorSub}`}
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
              <span className={`absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${isHomePage ? badgeHome : badgeSub}`}>
                {cartItemCount}
              </span>
            )}
          </Link>

          <ThemeToggle inverted={shouldInvertToggle} />
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden mt-4 pb-4">
          <ul className="flex flex-col gap-6 items-center">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              const mobileLinkClass = isHomePage
                ? isActive
                  ? mobileLinkActiveHome
                  : mobileLinkInactiveHome
                : isActive
                  ? mobileLinkActiveSub
                  : mobileLinkInactiveSub;

              return (
                <li key={item.id} className="relative">
                  <Link
                    href={item.href}
                    target={item.isExternal ? "_blank" : "_self"}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${mobileLinkBase} ${mobileLinkClass}`}
                  >
                    {item.text}
                    {!isActive && (
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 w-0 group-hover:w-full ${
                          isHomePage ? underlineHome : underlineSub
                        }`}
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
