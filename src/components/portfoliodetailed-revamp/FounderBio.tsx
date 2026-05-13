import type { Brand } from './types';

export const FounderBio = ({
  description,
}: {
  description: string;
  brand: Brand;
}) => {
  return (
    <p className="mt-3 font-display font-light text-[14px] leading-[1.6] tracking-[-0.005em] text-white/75">
      {description}
    </p>
  );
};
