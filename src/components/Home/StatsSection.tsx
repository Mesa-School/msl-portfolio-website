"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

const StatCard = ({ value, suffix = "", label, delay = 0 }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let step = 0;

    const timer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        step++;
        const current = Math.min(increment * step, value);
        setCount(Math.floor(current));

        if (step >= steps) {
          setCount(value);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, duration / steps);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
    >
      {/* Gradient border - matching WhyMslSection */}
      <div className="relative rounded-3xl bg-gradient-to-br from-purple-500/40 via-transparent to-purple-500/40 p-px transition duration-300 group-hover:from-purple-500/80 group-hover:to-purple-500/80">
        {/* Card content - matching WhyMslSection */}
        <div className="relative h-full rounded-3xl bg-black/80 p-7 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
          {/* Content */}
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            {count}
            {suffix}
          </div>
          <div className="text-base md:text-lg text-white/80 font-medium">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      value: 31,
      suffix: "",
      label: "Incubated Startups",
    },
    {
      value: 10,
      suffix: " Cr+",
      label: "Collective ARR",
    },
    {
      value:60,
      suffix: "+",
      label: "VCs Engaged",
    },
    {
      value: 8,
      suffix: " M+",
      label: "Invested by Mesa",
    },
  ];

  return (
    <section className="relative pt-10 bg-black text-white overflow-hidden">

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;

