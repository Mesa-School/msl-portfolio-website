import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MSL Demo Day",
  description: "Mesa Startup Lab Demo Day - Investor Portal",
  robots: { index: false, follow: false },
};

export default function DemoDayLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen text-white">
      {children}
    </main>
  );
}
