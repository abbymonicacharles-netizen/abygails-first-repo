import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import { BookshelfProvider } from "@/context/BookshelfContext";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brainstorm — Digital Bookshelf",
  description: "A cozy scrapbook that happens to manage projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-season="cozy" suppressHydrationWarning>
      <body className={`${nunito.variable} ${quicksand.variable} font-sans antialiased`}>
        <BookshelfProvider>{children}</BookshelfProvider>
      </body>
    </html>
  );
}
