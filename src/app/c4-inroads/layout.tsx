import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "C4 Inroads Results",
  description: "Meet the Mesa Startup Lab Cohort 4 founders selected for Inroads.",
  alternates: { canonical: "/c4-inroads" },
};

export default function C4InroadsLayout({ children }: { children: React.ReactNode }) {
  return <main className={`${poppins.variable} min-h-dvh font-(family-name:--font-poppins)`}>{children}</main>;
}
