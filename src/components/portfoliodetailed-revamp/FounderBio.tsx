'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Brand } from './types';

const LENGTH_HEURISTIC = 140;

export const FounderBio = ({
  description,
  brand,
}: {
  description: string;
  brand: Brand;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(
    () => description.length > LENGTH_HEURISTIC,
  );
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) return;
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      if (!ref.current) return;
      const truncated =
        ref.current.scrollHeight > ref.current.clientHeight + 1;
      setIsClamped(truncated);
    };

    measure();
    const t = window.setTimeout(measure, 60);

    const fontsApi = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fontsApi?.ready) {
      fontsApi.ready.then(measure).catch(() => {});
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(t);
    };
  }, [description, expanded]);

  return (
    <div className="mt-3">
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : '4.8em' }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p
          ref={ref}
          className={`font-display font-light text-[14px] leading-[1.6] tracking-[-0.005em] text-white/75 ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {description}
        </p>
      </motion.div>

      {(isClamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="group/bio-toggle mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.22em] uppercase underline underline-offset-[5px] decoration-1 hover:decoration-2 transition-[text-decoration-thickness] duration-200"
          style={{ color: brand.accent }}
          aria-expanded={expanded}
        >
          {expanded ? 'View less' : 'View more'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex"
          >
            <ChevronDown className="h-3 w-3" strokeWidth={2.25} />
          </motion.span>
        </button>
      )}
    </div>
  );
};
