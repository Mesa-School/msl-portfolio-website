import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

type Founder = {
  id: number | string;
  name: string;
  designation?: string | null;
};

export type Startup = {
  id: number | string;
  documentId: string;
  name: string;
  summary: string;
  location?: string | null;
  cohort?: string | null;
  sectorName?: string | null;
  logoUrl?: string | null;
  founders: Founder[];
};

type StartupOverviewCardProps = {
  startup: Startup;
  index: number;
};

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: custom * 0.05,
      ease: easing,
    },
  }),
};

const renderInitials = (name: string) =>
  name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

export const StartupOverviewCard = ({ startup, index }: StartupOverviewCardProps) => {
  const hasLogo = Boolean(startup.logoUrl);
  const founderNames = startup.founders.map((founder) => founder.name).join(', ');

  return (
    <motion.article
      className="group relative flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_35px_120px_rgba(5,7,15,0.65)] backdrop-blur"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      custom={index}
    >
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
          {hasLogo ? (
            <Image
              src={startup.logoUrl ?? ''}
              alt={`${startup.name} logo`}
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-2xl object-contain"
            />
          ) : (
            <span className="text-2xl font-semibold text-white/80">
              {renderInitials(startup.name)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            {startup.cohort ?? 'Active Cohort'}
          </p>
          <h3 className="text-2xl font-semibold">{startup.name}</h3>
          <p className="text-sm text-white/60">{startup.location ?? 'Global'}</p>
        </div>
      </div>

      <p className="relative text-sm leading-relaxed text-white/80">
        {startup.summary || 'No summary provided yet.'}
      </p>

      <dl className="relative grid grid-cols-1 gap-3 text-sm text-white/80 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-white/50">Sector</dt>
          <dd>{startup.sectorName ?? '—'}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-white/50">Location</dt>
          <dd>{startup.location ?? '—'}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-white/50">Cohort</dt>
          <dd>{startup.cohort ?? '—'}</dd>
        </div>
      </dl>

      {founderNames && (
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Founders</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-white/90">
            {startup.founders.map((founder) => (
              <li key={founder.id}>
                {founder.name}
                {founder.designation ? ` — ${founder.designation}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.article>
  );
};


