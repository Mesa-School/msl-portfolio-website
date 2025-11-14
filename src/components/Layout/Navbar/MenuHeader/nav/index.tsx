'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '../anim';
import Link from './Link';
import Curve from './Curve';

export interface MenuProps {
  onClose: () => void;
}

export interface NavItem {
  title: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'About Us', href: '#about' },
  { title: 'Our Startups', href: '#startups' },
  { title: 'Programs', href: '#programs' },
  { title: 'Contact', href: '#contact' },
];

export default function Menu({ onClose }: MenuProps) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState<string>(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed inset-0 flex h-screen w-screen flex-col bg-[#111] text-white backdrop-blur-3xl"
      style={{ zIndex: 9999 }}
    >
      <div className="flex justify-end p-5 md:p-8">
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="relative mr-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur transition-all duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] sm:h-14 sm:w-14"
        >
          <span className="absolute left-1/2 h-[2px] w-7 -translate-x-1/2 rotate-45 bg-white" />
          <span className="absolute left-1/2 h-[2px] w-7 -translate-x-1/2 -rotate-45 bg-white" />
        </button>
      </div>
      <div className="box-border flex flex-1 flex-col justify-between px-5 pb-5 md:px-20 md:pb-20">
        <div
          onMouseLeave={() => setSelectedIndicator(pathname)}
          className="mt-10 flex flex-col gap-3 justify-center text-2xl heading-font font-black md:mt-20 md:text-4xl"
        >
          {NAV_ITEMS.map((data, index) => (
            <Link
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
              onClose={onClose}
            />
          ))}
        </div>
      </div>

      <Curve />
    </motion.div>
  );
}