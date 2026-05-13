import type { Brand } from './types';
import { stripTodo } from './utils';

export const IdentityRow = ({
  tagline,
  twoLiner,
  brand,
}: {
  tagline: string;
  twoLiner: string;
  brand: Brand;
}) => {
  return (
    <div className="mt-6">
      <h2 className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[clamp(28px,4vw,48px)]">
        <span className="italic" style={{ color: brand.accent }}>
          &ldquo;
        </span>
        {stripTodo(tagline)}
        <span className="italic" style={{ color: brand.accent }}>
          &rdquo;
        </span>
      </h2>

      <p className="mt-4 text-sm md:text-[15px] leading-[1.6] text-white/75">
        {twoLiner}
      </p>
    </div>
  );
};
