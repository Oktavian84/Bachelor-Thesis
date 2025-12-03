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
    <footer>
      <nav>
        <ul>
          {policies.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                target={item.isExternal ? "_blank" : "_self"}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <StrapiImage
          src={logo.image.url}
          alt={logo.image.alternativeText || "No alternative text"}
          width={100}
          height={100}
        />
        <p>
          &copy; {new Date().getFullYear()} {copy}
        </p>
      </div>
    </footer>
  );
}
