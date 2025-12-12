"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const WhyMslSection = () => {
  const pillars = [
    {
      title: "Sharpen your vision.",
      description:
        "Turn bold ideas into a clear direction with structured founder-first guidance.",
    },
    {
      title: "Test with real customers.",
      description:
        "Ship fast, chase meaningful traction, and validate every hypothesis in-market.",
    },
    {
      title: "Access Indian operators.",
      description:
        "Work with mentors, operators, and investors who have scaled Indian companies.",
    }
  ];

  return (
    <section
      id="why-msl"
      className="relative flex items-center overflow-hidden bg-black text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-600/50 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/50 blur-[160px]" />
      </div>
      
      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div
            className="relative w-full h-full min-h-[500px] lg:min-h-[600px]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <Image
                src="/why_msl_sidak.png"
                alt="Anupam Mittal"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay for better visual integration */}
              <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="heading-font text-3xl font-bold md:text-5xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Why MSL?
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl mb-12 font-medium text-white/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Because India needs more than generic accelerators.
            </motion.p>

            {/* Numbered Bullet Points */}
            <div className="flex flex-col gap-8">
              {pillars.map(({ title, description }, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="relative rounded-2xl bg-gradient-to-br from-purple-500/40 via-transparent to-purple-500/40 p-px">
                      <div className="relative rounded-2xl bg-black/80 backdrop-blur flex flex-col justify-center items-center w-14 h-14 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
                        <span className="heading-font text-2xl md:text-3xl font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="heading-font text-xl md:text-2xl font-semibold text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-base md:text-md text-white/80">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyMslSection;

