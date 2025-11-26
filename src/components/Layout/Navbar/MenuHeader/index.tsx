"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Nav from "./nav";

interface MenuHeaderProps {
  triggerClassName?: string;
};

export default function MenuHeader({ triggerClassName }: MenuHeaderProps) {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsActive(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        aria-label={isActive ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isActive}
        onClick={() => setIsActive((prev) => !prev)}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 cursor-pointer hover:scale-125 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ",
          triggerClassName,
          isActive && "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute left-1/2 h-px w-1/2 -translate-x-1/2 bg-white transition-transform duration-300",
            isActive ? "translate-y-0 rotate-45" : "-translate-y-1"
          )}
        />
        <span
          className={cn(
            "absolute left-1/2 h-px w-1/2 -translate-x-1/2 bg-white transition-transform duration-300",
            isActive ? "translate-y-0 -rotate-45" : "translate-y-1"
          )}
        />
      </button>
      <AnimatePresence mode="wait">
        {isActive && <Nav onClose={() => setIsActive(false)} />}
      </AnimatePresence>
    </>
  );
};