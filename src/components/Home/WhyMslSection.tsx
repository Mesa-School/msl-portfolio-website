"use client";

import Tilt from "react-parallax-tilt";
import { Compass, Target, Users2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const WhyMslSection = () => {
  const pillars = [
    {
      title: "Sharpen your vision.",
      description:
        "Turn bold ideas into a clear direction with structured founder-first guidance.",
      icon: Compass,
    },
    {
      title: "Test with real customers.",
      description:
        "Ship fast, chase meaningful traction, and validate every hypothesis in-market.",
      icon: Target,
    },
    {
      title: "Access Indian operators.",
      description:
        "Work with mentors, operators, and investors who have scaled Indian companies.",
      icon: Users2,
    },
    {
      title: "Build conviction.",
      description:
        "We stay in the trenches with you so you can confidently raise, hire, and grow.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="why-msl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-600/50 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-500/50 blur-[160px]" />
      </div>
      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        }}
      >
        <motion.p
          className="text-xl font-semibold uppercase tracking-[0.35em] text-purple-300"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Why MSL?
        </motion.p>
        <motion.h2
          className="heading-font mt-5 text-3xl font-bold md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Because India needs more than generic accelerators.
        </motion.h2>
        <motion.p
          className="mt-6 text-base text-white/80 md:text-lg lg:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          At Mesa Startup Lab, founders don’t just build startups — they build conviction.
          We are India’s founder-first incubator, designed to help you sharpen your ideas,
          pressure-test with real customers, and surround yourself with people who have actually
          built for India.
        </motion.p>

        <motion.div
          className="mt-16 grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {pillars.map(({ title, description, icon: Icon }, index) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.65, ease: "easeOut" },
                },
              }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
            >
              <Tilt
                glareEnable
                glareColor="rgba(168,85,247,0.35)"
                glareMaxOpacity={0.35}
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                className="group"
              >
                <div className="relative rounded-3xl bg-linear-to-br from-purple-500/40 via-transparent to-pink-500/40 p-px transition duration-300 group-hover:from-purple-500/80 group-hover:to-pink-500/80">
                  <div className="relative h-full rounded-3xl bg-black/80 p-7 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                      <Icon size={26} />
                    </div>
                    <h3 className="heading-font text-2xl font-semibold text-white">{title}</h3>
                    <p className="mt-4 text-base text-white/80">{description}</p>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhyMslSection;

