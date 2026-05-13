'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, Mail, Linkedin, Instagram } from 'lucide-react';

const connectLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/mesa-school-of-business',
    icon: Linkedin,
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mesaschool',
    icon: Instagram,
    external: true,
  },
  {
    label: 'msl@mesaschool.co',
    href: 'mailto:msl@mesaschool.co',
    icon: Mail,
    external: false,
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-msl-page text-white">
      {/* Atmospheric top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-64 -z-10 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 50% 100%, var(--color-msl-accent, #27614A)33 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-12 pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-7">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo-mesa.png"
                alt="Mesa Startup Lab"
                width={140}
                height={56}
                className="h-10 md:h-11 w-auto object-contain rounded-md transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-[1.7] text-white/55">
              India&rsquo;s launchpad for the next generation of builders.
              Backing student and early&#8209;stage founders across D2C, AI,
              and services.
            </p>

            <a
              href="mailto:msl@mesaschool.co"
              className="group/cta mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] backdrop-blur-md px-4 py-2 text-[12px] tracking-[0.05em] text-white/75 hover:bg-white/[0.07] hover:border-white/22 hover:text-white transition-colors"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
            </a>
          </div>

          {/* Connect column */}
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-white/35 mb-5">
              Connect
            </div>
            <ul className="space-y-3">
              {connectLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="group/link inline-flex items-center gap-2.5 text-[14px] text-white/70 hover:text-white transition-colors"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] group-hover/link:bg-white/8 group-hover/link:border-white/22 transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="border-b border-transparent group-hover/link:border-white/40 transition-colors">
                        {link.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 sm:mt-14 mb-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] tracking-wide text-white/40 text-center sm:text-left">
            &copy; {currentYear} Mesa Startup Lab. All rights reserved.
          </p>

          <div className="mx-auto sm:mx-0 inline-flex items-center gap-1.5 text-[11px] tracking-wide text-white/45">
            <span>Built with</span>
            <a
              href="https://www.linkedin.com/in/gauravdev04/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Built with love — visit on LinkedIn"
              title="Visit on LinkedIn"
              className="group/heart inline-flex items-center justify-center -mx-0.5 px-1 py-0.5 rounded-full"
            >
              <motion.span
                animate={{ scale: [1, 1.18, 1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <Heart
                  className="h-3.5 w-3.5 fill-rose-500 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)] group-hover/heart:drop-shadow-[0_0_12px_rgba(244,63,94,0.85)] transition-[filter] duration-300"
                  strokeWidth={2}
                />
              </motion.span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
