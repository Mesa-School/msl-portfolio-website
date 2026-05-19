import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://msl.mesaschool.co.in";

export const SITE_NAME = "Mesa Startup Lab";

export const DEFAULT_DESCRIPTION =
  "Mesa Startup Lab is India's launchpad for the next generation of builders — backing student and early-stage founders across D2C, AI, and services.";

/** Absolute, HTTPS, cross-platform social preview image. */
export const OG_IMAGE_URL =
  "https://storage.googleapis.com/careers-crm-data/mesa-assets/mesa_startup_lab_logo.jpeg";

/** Shared OpenGraph image descriptor — reuse on every route so previews never fall back to the favicon. */
export const OG_IMAGE: NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> = [
  {
    url: OG_IMAGE_URL,
    secureUrl: OG_IMAGE_URL,
    width: 1200,
    height: 630,
    type: "image/jpeg",
    alt: `${SITE_NAME} logo`,
  },
];

/** Shared Twitter image descriptor. */
export const TWITTER_IMAGE = [{ url: OG_IMAGE_URL, alt: `${SITE_NAME} logo` }];
