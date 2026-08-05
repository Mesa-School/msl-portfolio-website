'use client';

import { motion } from 'framer-motion';

/**
 * Eight particles flung outward as the tick lands.
 *
 * They must travel clear of the drawn ring (~41px) — stopping near it makes the
 * dots read as clock markings rather than a burst. Offset half a step so none
 * sits directly on the tick.
 */
const BURST = Array.from({ length: 8 }, (_, i) => {
  const angle = ((i + 0.5) / 8) * Math.PI * 2;
  return {
    x: Math.cos(angle) * 74,
    y: Math.sin(angle) * 74,
    delay: 0.42 + (i % 4) * 0.025,
  };
});

type SuccessTickProps = {
  /** Ring + tick colour. */
  color: string;
  size?: number;
};

/**
 * Confirmation mark for the interest dialog.
 *
 * Sequenced rather than simultaneous: the disc pops, the ring draws itself
 * around it, the tick strokes on, and a burst radiates out — so it reads as one
 * gesture completing instead of four things appearing at once.
 */
export const SuccessTick = ({ color, size = 92 }: SuccessTickProps) => {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Burst particles */}
      {BURST.map((point, index) => (
        <motion.span
          key={index}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            // Fully faded before reaching the outer extent, so the dots read as
            // a spray dissipating rather than eight points parking in a ring.
            opacity: [0, 1, 0.9, 0],
            scale: [0, 1, 0.75, 0],
            x: point.x,
            y: point.y,
          }}
          transition={{
            duration: 0.7,
            delay: point.delay,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.25, 0.6, 1],
          }}
        />
      ))}

      {/* Soft disc behind the mark */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: `${color}1f` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      />

      {/* Expanding halo, once */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${color}` }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.6, opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
      />

      <motion.svg
        viewBox="0 0 52 52"
        fill="none"
        className="relative"
        style={{ width: size, height: size }}
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 16 }}
      >
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          // Start the stroke at 12 o'clock rather than 3 o'clock.
          style={{ rotate: -90, transformOrigin: '50% 50%' }}
        />
        <motion.path
          d="M15.5 26.5 L23 34 L37 19.5"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.38, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.svg>
    </div>
  );
};
