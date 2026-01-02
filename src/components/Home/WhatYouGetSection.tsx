"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Users,
  Brain,
  Network,
  GraduationCap,
  Building2,
  Handshake,
  Calendar,
  Trophy,
  Clock,
} from "lucide-react";

const WhatYouGetSection = () => {
  const benefits = [
    // {
    //   title: "Founder-Led Mentorship",
    //   description: "Direct sparring with the MSL core team.",
    //   icon: Users,
    // },
    {
      title: "Mentor Bench",
      description: "Leading operators and industry experts aligned to your milestones.",
      icon: GraduationCap,
    },
    {
      title: "Specialist Access",
      description: "AI/tech generalists, growth and marketing operators.",
      icon: Brain,
    },
    {
      title: "Investor Network",
      description: "Curated introductions and fundraising readiness.",
      icon: Network,
    },

    // {
    //   title: "Workspace",
    //   description: "Build with your team from our dedicated campus.",
    //   icon: Building2,
    // },
    {
      title: "Partnerships & Credits",
      description: "Startup tools, corporate connects, competitions.",
      icon: Handshake,
    },
    // {
    //   title: "Structured Check-ins",
    //   description: "1:1 accountability, tailored to your journey.",
    //   icon: Calendar,
    // },
    // {
    //   title: "Victory Fridays",
    //   description: "Weekly peer updates and shared learnings.",
    //   icon: Trophy,
    // },
    // {
    //   title: "Additional Building Time",
    //   description: "Hours intentionally carved out for your company's growth.",
    //   icon: Clock,
    // },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image - Full Cover */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_what_do_you_get.JPG"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-font text-3xl md:text-5xl font-bold mb-4">
            What You Get at MSL
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            At MSL, you don't just get resources — you get leverage.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
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
              >
                <div className="flex flex-col gap-2 relative rounded-2xl bg-black/10 
                backdrop-blur-xs border border-white/20 p-4 transition-all 
                duration-300 hover:bg-purple-600/10 hover:border-purple-500 
                h-full group">

                  {/* Icon */}
                  <div className="inline-flex h-14 w-14 items-center justify-center 
                  rounded-xl bg-white/20 text-white shadow-lg 
                  group-hover:bg-white/30 transition-colors">
                    <Icon size={28} />
                  </div>

                  {/* Content */}
                  <h3 className="heading-font text-xl font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-[1rem] text-white/90">
                    {benefit.description}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;

