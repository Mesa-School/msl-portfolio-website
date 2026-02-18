'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  skeletonClassName?: string;
};

const ImageWithSkeleton = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  skeletonClassName = '',
}: ImageWithSkeletonProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-white/5 flex items-center justify-center ${className}`}>
        <span className="text-white/30 text-xs">—</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <Skeleton
          className={`absolute inset-0 animate-pulse bg-white/10 ${skeletonClassName}`}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default ImageWithSkeleton;
