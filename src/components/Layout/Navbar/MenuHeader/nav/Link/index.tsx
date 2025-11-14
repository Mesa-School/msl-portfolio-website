"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "../../anim";
import type { Dispatch, SetStateAction } from "react";
import type { NavItem } from "..";

interface NavLinkData extends NavItem {
  index: number;
}

interface NavLinkProps {
  data: NavLinkData;
  isActive: boolean;
  setSelectedIndicator: Dispatch<SetStateAction<string>>;
  onClose: () => void;
}

export default function NavLink({
  data,
  isActive,
  setSelectedIndicator,
  onClose,
}: NavLinkProps) {
  const { title, href, index } = data;

  return (
    <motion.div
      className="relative flex items-center"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className="absolute -left-7 w-2.5 h-2.5 bg-purple-500 rounded-full"
      />
      <Link
        href={href}
        className="my-3 font-light text-3xl text-white transition-colors duration-200 hover:text-purple-500 md:text-5xl"
      >
        {title}
      </Link>
    </motion.div>
  );
}