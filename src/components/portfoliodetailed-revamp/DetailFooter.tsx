export const DetailFooter = ({
  cohort,
  publishedAt,
  slug,
}: {
  cohort: string;
  publishedAt: string;
  slug: string;
}) => {
  const year = publishedAt
    ? new Date(publishedAt).getFullYear()
    : new Date().getFullYear();

  return (
    <footer className="mt-12 pt-5 border-t border-white/8">
      <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 text-center leading-relaxed">
        © {year} Mesa Startup Lab · {cohort} · Doc/{slug}/v2
      </div>
    </footer>
  );
};
