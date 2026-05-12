import type { Brand } from './types';
import { SectionLabel } from './SectionLabel';
import { stripTodo, isPresent } from './utils';

export const WhyNowSection = ({ whyNow, brand }: { whyNow: string; brand: Brand }) => {
  const cleaned = stripTodo(whyNow);
  if (!isPresent(cleaned)) return null;

  return (
    <section className="mt-9 pt-9 border-t border-white/6 grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-3">
        <SectionLabel number="04" eyebrow="Timing" title="Why now" brand={brand} />
      </div>
      <div className="col-span-12 lg:col-span-9">
        <p className="text-[15px] leading-[1.7] font-light text-white/85 text-justify hyphens-auto">
          {cleaned}
        </p>
      </div>
    </section>
  );
};
