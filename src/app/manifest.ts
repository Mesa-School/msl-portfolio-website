import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mesa Startup Lab',
    short_name: 'MSL',
    description:
      "Mesa Startup Lab is India's launchpad for the next generation of builders — backing student and early-stage founders across D2C, AI, and services.",
    start_url: '/',
    display: 'standalone',
    background_color: '#060a0a',
    theme_color: '#27614A',
    orientation: 'portrait',
    icons: [
      {
        src: '/logo-mesa.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/mesalogo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
