import { Fraunces, Manrope, IBM_Plex_Mono, Poppins } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

/**
 * Used only by the interest dialog. That dialog is portalled to document.body,
 * so it sits outside `fontVariables` and has to carry its own font class.
 */
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const fontVariables = `${fraunces.variable} ${manrope.variable} ${mono.variable}`;
