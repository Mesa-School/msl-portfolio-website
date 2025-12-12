"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const StartupLogosSection = () => {
  const logos = [
    { name: "Aerie", image: "/brand_logos/aierie.png", sector:"D2C" },
    { name: "Cozy", image: "/brand_logos/cozy.png", sector:"D2B/Market Place" },
    { name: "Custom Infra", image: "/brand_logos/custom_infra.png" ,sector:"D2C"},
    { name: "Dhobi", image: "/brand_logos/dhobi.png" ,sector:"D2C"},
    { name: "Everaw", image: "/brand_logos/everaw.png" ,sector:"D2B/Market Place"},
    { name: "FabInvest", image: "/brand_logos/fabinvest.png" ,sector:"D2C"},
    { name: "Half Boiled", image: "/brand_logos/half_boiled.png" ,sector:"D2B/Market Place"},
    { name: "Humara Pandit", image: "/brand_logos/humara_pandit.png" ,sector:"D2C"},
    { name: "Mumbai Pav Co.", image: "/brand_logos/mpc.png" ,sector:"D2C"},
    { name: "Swasta", image: "/brand_logos/swasta.png" ,sector:"D2C"},
    { name: "Vastr", image: "/brand_logos/vastr.png" ,sector:"D2C"},
    { name: "Wave", image: "/brand_logos/wave.png" ,sector:"AI"},
    { name: "ZenAnt", image: "/brand_logos/zenant.png" ,sector:"AI"},
    { name: "Communal AI", image: "/brand_logos/communal_ai_logo.jpg" ,sector:"AI"},
  ];

  const categories = [
    { title: "Artificial Intelligence (AI)", key: "AI" },
    { title: "D2B (Market Place)", key: "D2B/Market Place" },
    { title: "D2C (Consumer)", key: "D2C" },
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
            Our Startups
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Building the next generation of Indian startups
          </p>
        </motion.div>

        {/* Categorized logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, idx) => {
            const items = logos.filter((logo) => logo.sector === category.key);
            return (
              <motion.div
                key={category.key}
                className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="heading-font text-xl md:text-2xl font-semibold text-white">
                    {category.title}
                  </h3>
                  {/* <span className="text-sm text-white/60">{items.length} startups</span> */}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items.map((logo, index) => (
                    <motion.div
                      key={`${category.key}-${index}`}
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      className="group"
                    >
                      <div className="relative aspect-square flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                        <Image
                          src={logo.image}
                          alt={logo.name}
                          width={120}
                          height={120}
                          className="w-full h-full bg-white object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <p className="mt-2 text-center text-sm text-white/80 leading-tight">
                        {logo.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StartupLogosSection;

