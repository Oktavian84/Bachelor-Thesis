import type { Metadata } from "next";
import { Lugrasimo, Caudex } from "next/font/google";
import "./globals.css";
import { getGlobalSettings } from "@/data/loaders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollSnapProvider } from "@/contexts/ScrollSnapContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const lugrasimo = Lugrasimo({
  variable: "--font-lugrasimo",
  subsets: ["latin"],
  weight: "400",
});

const caudex = Caudex({
  variable: "--font-caudex",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CINC ART - Metal Sculptures & Art",
  description:
    "Discover stunning welded metal sculptures and art pieces. Each creation is a unique masterpiece of craftsmanship and creativity.",
};

async function loader() {
  const res = await getGlobalSettings()
  const data = res?.data

  return {
    header: data?.header ?? null,
    footer: data?.footer ?? null,
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { header, footer } = await loader();
  return (
    <html lang="en">
      <body
        className={`${lugrasimo.variable} ${caudex.variable} antialiased flex flex-col dark`}
      >
              <ThemeProvider>
              <CartProvider>
                <ScrollSnapProvider>
                  <Header data={header} />
                  <main className="flex-1 flex flex-col justify-center sm:justify-start mt-0 sm:mt-5">{children}</main>
                  <Footer data={footer} />
                </ScrollSnapProvider>
              </CartProvider>
              </ThemeProvider>
      </body>
    </html>
  );
}
