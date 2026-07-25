import type { Metadata } from "next";
import { Suspense } from "react";
import { Karla, Libre_Baskerville } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Brainstorm — Digital Bookshelf",
  description: "A refined scrapbook for student projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${karla.variable} ${baskerville.variable} font-sans antialiased`}>
        <Suspense fallback={<div className="room min-h-[100svh]" />}>
          <AppProviders>{children}</AppProviders>
        </Suspense>
      </body>
    </html>
  );
}
