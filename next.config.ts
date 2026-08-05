import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  // The VC portal moved from /demo-day/* to /demo-day/vc/* so /demo-day could
  // become the public Demo Day startup list. Kept temporary (308, not 301) so
  // browsers don't cache the hop permanently if we move it back.
  async redirects() {
    return [
      {
        source: '/demo-day/live',
        destination: '/demo-day/vc/live',
        permanent: false,
      },
      {
        source: '/demo-day/on-boarding',
        destination: '/demo-day/vc/on-boarding',
        permanent: false,
      },
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/images',
        search: '*',
      },
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
