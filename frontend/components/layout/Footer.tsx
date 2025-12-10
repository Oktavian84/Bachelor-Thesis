import type { LinkProps, LogoProps } from "@/types";

import Link from "next/link";
import { StrapiImage } from "../StrapiImage";

interface FooterProps {
  data: {
    logo: LogoProps;
    policies: LinkProps[];
    copy: string;
  };
}

export function Footer({ data }: FooterProps) {
  if (!data) return null;

  const { logo, policies, copy } = data;
  return (
    <footer className="bg-black px-8 py-6 z-[60] relative">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav>
          <ul className="flex flex-row flex-wrap gap-6 justify-center md:justify-start">
            {policies.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  className="text-white text-lg hover:opacity-80 transition-opacity"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <p className="text-white text-sm whitespace-nowrap">
            &copy; {new Date().getFullYear()} {copy}
          </p>
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || "No alternative text"}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
