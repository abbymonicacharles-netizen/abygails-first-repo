import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { BrainstormProvider } from "@/context/BrainstormContext";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Brainstorm — Projects as books",
  description:
    "Project management where every project is a customizable digital book with chapters, creative pages, and tasks.",
  openGraph: {
    title: "Brainstorm — Projects as books",
    description:
      "A workspace that turns projects into living books on a virtual bookshelf.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} ${syne.variable} font-sans antialiased`}>
        <BrainstormProvider>{children}</BrainstormProvider>
      </body>
    </html>
  );
}
