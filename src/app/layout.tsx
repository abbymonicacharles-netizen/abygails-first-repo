import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Abygail Charles | Tutor & Recent Graduate",
  description:
    "Personal site of Abygail Charles — tutor based in East Trinidad & Tobago, helping recently graduated students succeed.",
  openGraph: {
    title: "Abygail Charles",
    description:
      "Tutor based in East Trinidad & Tobago. Hardworking, positive, and dedicated to helping students thrive.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
