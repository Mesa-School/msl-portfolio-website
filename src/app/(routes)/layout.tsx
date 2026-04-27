"use client";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer/Footer";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIgniteRoute = pathname?.startsWith("/ignite") ?? false;

  return (
    <div className={cn("min-h-screen bg-msl-page", isIgniteRoute && "theme-ignite")}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
