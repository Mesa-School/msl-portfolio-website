'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '../anim';
import Link from './Link';
import Curve from './Curve';

export interface MenuProps {
  onClose: () => void;
};

export interface NavItem {
  title: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Our Startups', href: '/our-startups' },
  { title: 'Contact', href: '#contact' },
];

export default function Menu({ onClose }: MenuProps) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState<string>(pathname);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const menuContent = (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed inset-0 flex h-screen w-screen flex-col bg-[#111] text-white backdrop-blur-3xl"
      style={{ 
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      <div className="flex justify-end p-5 md:p-8">
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/30 shadow-lg backdrop-blur transition-all cursor-pointer hover:scale-125 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 "
        >
          <span className="absolute left-1/2 h-[2px] w-5 -translate-x-1/2 rotate-45 bg-white" />
          <span className="absolute left-1/2 h-[2px] w-5 -translate-x-1/2 -rotate-45 bg-white" />
        </button>
      </div>
      <div className="box-border flex flex-1 flex-col justify-between items-center md:items-start px-10 pb-10 md:px-20 md:pb-20">
        <div
          onMouseLeave={() => setSelectedIndicator(pathname)}
          className="mt-10 flex flex-col gap-3 justify-center items-center md:items-start text-3xl heading-font font-black md:mt-20 md:text-4xl"
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

  // Render menu in portal at body level to avoid any parent container constraints
  if (!mounted) return null;
  
  return createPortal(menuContent, document.body);
}