import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import { DM_Sans, Oswald } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mesa Startup Lab",
  description: "Mesa Startup Lab is a startup incubator that helps startups grow and succeed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${oswald.variable} bg-black text-white antialiased`}>
        <Navbar />
        <main className="">{children}</main>
      </body>
    </html>
  );
}
