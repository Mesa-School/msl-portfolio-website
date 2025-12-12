"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const StartupLogosSection = () => {
  const logos = [
    { name: "Aerie", image: "/brand_logos/aierie.png" },
    { name: "Cozy", image: "/brand_logos/cozy.png" },
    { name: "Custom Infra", image: "/brand_logos/custom_infra.png" },
    { name: "Dhobi", image: "/brand_logos/dhobi.png" },
    { name: "Everaw", image: "/brand_logos/everaw.png" },
    { name: "FabInvest", image: "/brand_logos/fabinvest.png" },
    { name: "Half Boiled", image: "/brand_logos/half_boiled.png" },
    { name: "Humara Pandit", image: "/brand_logos/humara_pandit.png" },
    { name: "Mumbai Pav Co.", image: "/brand_logos/mpc.png" },
    { name: "Swasta", image: "/brand_logos/swasta.png" },
    { name: "Vastr", image: "/brand_logos/vastr.png" },
    { name: "Wave", image: "/brand_logos/wave.png" },
    { name: "ZenAnt", image: "/brand_logos/zenant.png" },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-black text-white overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-600/50 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/50 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-font text-3xl md:text-5xl font-bold mb-4">
            Our Portfolio Startups
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Building the next generation of Indian startups
          </p>
        </motion.div>

        {/* Logos Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group"
            >
              <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-2 aspect-square flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={120}
                  height={120}
                  className="w-full h-full bg-white object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StartupLogosSection;

