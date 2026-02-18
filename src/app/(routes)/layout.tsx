import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer/Footer";

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
