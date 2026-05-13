'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type MediaImageProps = Omit<ImageProps, 'onLoad' | 'onError'> & {
  brandTint?: string;
  skeletonClassName?: string;
  rounded?: string;
};

export const MediaImage = ({
  brandTint = '#27614A',
  skeletonClassName = '',
  rounded = '',
  className = '',
  alt,
  ...imageProps
}: MediaImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isLoading && !hasError && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-none absolute inset-0 overflow-hidden ${rounded} ${skeletonClassName}`}
            aria-hidden
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.035) 0%, ${brandTint}1a 50%, rgba(255,255,255,0.035) 100%)`,
            }}
          >
            <motion.div
              className="absolute inset-y-0 -left-1/3 w-1/2"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${brandTint}40 45%, rgba(255,255,255,0.18) 55%, transparent 100%)`,
                filter: 'blur(18px)',
              }}
              initial={{ x: '-60%' }}
              animate={{ x: '320%' }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: `radial-gradient(ellipse at center, ${brandTint}14 0%, transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {hasError ? (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-white/[0.03] ${rounded}`}
        >
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/30">
            Unavailable
          </span>
        </div>
      ) : (
        <Image
          {...imageProps}
          alt={alt}
          className={`${className} transition-opacity duration-[600ms] ease-out ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </>
  );
};
