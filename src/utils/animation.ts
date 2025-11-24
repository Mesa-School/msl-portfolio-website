import { motion, type Variants } from "framer-motion";

export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
        },
    },
};

export const backgroundVariants: Variants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.2,
        },
    },
};

export const headingVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 50,
        rotateX: -20,
        rotateY: 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        transition: {
            duration: 1,
        },
    },
};