import type { Brand } from './types';

export const BrandAtmosphere = ({ brand }: { brand: Brand }) => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    <div
      className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl"
      style={{ background: `radial-gradient(circle, ${brand.primary} 0%, transparent 70%)` }}
    />
    <div
      className="absolute top-[40vh] -left-40 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-3xl"
      style={{ background: `radial-gradient(circle, ${brand.accent} 0%, transparent 70%)` }}
    />
    <div
      className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      }}
    />
  </div>
);
