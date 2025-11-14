import type { Variants } from "framer-motion";

export const menuSlide: Variants = {
  initial: { x: "100%" },
  enter: {
    x: "0",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

const defaultDelay = 0.05;

export const slide: Variants = {
  initial: { x: 80 },
  enter: (i: number = 0) => ({
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: defaultDelay * i,
    },
  }),
  exit: (i: number = 0) => ({
    x: 80,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: defaultDelay * i,
    },
  }),
};

export const scale: Variants = {
  open: { scale: 1, transition: { duration: 0.3 } },
  closed: { scale: 0, transition: { duration: 0.4 } },
};
