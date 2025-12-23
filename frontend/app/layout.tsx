import type { Metadata } from "next";
import { Lugrasimo, Caudex, DM_Serif_Text } from "next/font/google";
import "./globals.css";
import { getGlobalSettings } from "@/data/loaders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollSnapProvider } from "@/contexts/ScrollSnapContext";

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

const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif-text",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CINC ART - Metal Sculptures & Art",
  description:
    "Discover stunning welded metal sculptures and art pieces. Each creation is a unique masterpiece of craftsmanship and creativity.",
};

async function loader() {
  const { data } = await getGlobalSettings();
  if (!data) throw new Error("Global settings not found");
  return { header: data?.header, footer: data?.footer };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { header, footer } = await loader();
  return (
    <html lang="en">
      <body
        className={`${lugrasimo.variable} ${caudex.variable} ${dmSerifText.variable} antialiased flex flex-col`}
      >
              <CartProvider>
                <ScrollSnapProvider>
                  <Header data={header} />
                  <main className="flex-1 flex flex-col justify-center sm:justify-start mt-0 sm:mt-5">{children}</main>
                  <Footer data={footer} />
                </ScrollSnapProvider>
              </CartProvider>
      </body>
    </html>
  );
}
