import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getGlobalSettings } from "@/data/loaders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CINC ART - Metal Sculptures & Art",
  description: "Discover stunning welded metal sculptures and art pieces. Each creation is a unique masterpiece of craftsmanship and creativity.",
};

async function loader() {
  const { data } = await getGlobalSettings();
  if (!data) throw new Error("Global settings not found");
  return { header: data?.header, footer: data?.footer };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header, footer } = await loader();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Header data={header} />
        {children}
      <Footer data={footer} />
      </body>
    </html>
  );
}
