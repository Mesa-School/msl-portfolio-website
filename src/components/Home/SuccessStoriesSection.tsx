"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const SuccessStoriesSection = () => {
  const successStories = [
    {
      company: "Mumbai Pav Co.",
      founders: "Jash & Tanay",
      metrics: "8 Cr Annualised Revenue, 5 new stores",
      image: "/success_stories/mpc.png",
    },
    {
      company: "Bloc",
      founders: "Rishabh",
      metrics: "2L+ MRR, BYOB to MSL Success",
      image: "/success_stories/bloc.jpg",
    },
    {
      company: "Aerie",
      founders: "Parul",
      metrics: "4.5 L MRR, 40% student success",
      image: "/success_stories/aerie.png",
    },
    {
      company: "Custom Infra",
      founders: "Samyak",
      metrics: "10L+ MRR, Family Business to Startup",
      image: "/success_stories/custom_infra.jpg",
    },
    {
      company: "Everaw Nutrition",
      founders: "Lucky",
      metrics: "6L+ Monthly Revenue, launched through BYOB",
      image: "/success_stories/everaw.jpg",
    },
    {
      company: "WAVE",
      founders: "Aastha",
      metrics: "1000+ Monthly Users, non-tech AI founder",
      image: "/success_stories/wave.png",
    },
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
            Success Stories from Mesa Startup Lab
          </h2>
        </motion.div>

        {/* Success Stories Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group"
            >
              <div className="relative rounded-3xl bg-gradient-to-br from-purple-500/40 via-transparent to-purple-500/40 p-px transition duration-300 hover:from-purple-500/60 hover:to-purple-500/60 h-full overflow-hidden">
                <div className="relative rounded-3xl bg-black/80 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur h-full overflow-hidden aspect-[4/3]">
                  {/* Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src={story.image}
                      alt={story.company}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Gradient overlay from transparent to black */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    {/* Content overlaid on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col">
                      <h3 className="heading-font text-2xl font-semibold text-white mb-1">
                        {story.company}
                      </h3>
                      <p className="text-sm text-white/80 mb-1">
                        {story.founders}
                      </p>
                      <p className="text-base text-white/90">
                        {story.metrics}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;

