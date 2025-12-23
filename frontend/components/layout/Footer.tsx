"use client";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

interface FooterProps {
  data: {
    logo: LogoProps;
    policies: LinkProps[];
    copy: string;
  };
}

export function Footer({ data }: FooterProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  if (!data) return null;

  const { policies, copy } = data;
  return (
    <footer className={`px-8 py-2 sm:py-6 z-60 relative max-[639px]:mt-auto ${
      isLight ? 'bg-white' : 'bg-black'
    }`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav>
          <ul className="flex flex-row flex-wrap gap-6 justify-center md:justify-start">
            {policies.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={item.href}
                    target={item.isExternal ? "_blank" : "_self"}
                    className={`font-lugrasimo text-lg transition-all duration-300 relative group pb-1 px-3 py-1 rounded-tr-[8rem] rounded-tl-[8rem] rounded-br-[8rem] rounded-bl-[8rem] ${
                      isActive
                        ? isLight
                          ? "bg-black text-white"
                          : "bg-white text-black"
                        : isLight
                          ? "text-black hover:bg-black/20 hover:text-black"
                        : "text-white hover:bg-white/40 hover:text-white"
                    }`}
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <p className={`text-[0.7rem] whitespace-nowrap ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            &copy; {new Date().getFullYear()} {copy}
          </p>
        </div>
      </div>
    </footer>
  );
}
