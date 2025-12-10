"use client";

import { motion } from "framer-motion";
import { Compass, Hammer, TrendingUp, Rocket, DollarSign } from "lucide-react";

const MslJourneySection = () => {
    const stages = [
        {
            title: "Foundation",
            description: "Deep clarity on problem and purpose.",
            icon: Compass,
        },
        {
            title: "Build",
            description: "Move from zero-to-one with real users.",
            icon: Hammer,
        },
        {
            title: "PMF Signal",
            description: "Test traction and shape product-market fit.",
            icon: TrendingUp,
        },
        {
            title: "Growth",
            description: "Scale distribution, strengthen systems.",
            icon: Rocket,
        },
        {
            title: "Fundraise/Scale Ready",
            description: "Craft the story, metrics, and access you need for capital.",
            icon: DollarSign,
        },
    ];

    return (
        <section className="relative py-16 md:py-24 bg-black text-white overflow-hidden">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-600/50 blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/50 blur-[160px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="heading-font text-3xl md:text-5xl font-bold mb-4">
                        The MSL Journey
                    </h2>
                    <p className="text-xl md:text-2xl text-white/80 mb-6 max-w-3xl mx-auto">
                        Every founder's path is different, but the inflection points are universal.
                    </p>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                        At MSL, we help you navigate the five stages of building:
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Central Timeline Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500/40 via-purple-500/60 to-purple-500/40 hidden md:block" />

                    {/* Timeline Items */}
                    <div className="space-y-24 md:space-y-10">
                        {stages.map((stage, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    className="relative"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div className="relative grid grid-cols-1 md:grid-cols-12 items-center">
                                        {/* Content Card - Alternates left and right */}
                                        <div
                                            className={`md:col-span-5 ${isEven
                                                    ? "md:col-start-1 md:text-right md:pr-8"
                                                    : "md:col-start-8 md:text-left md:pl-8"
                                                }`}
                                        >
                                            <div className="relative rounded-3xl bg-linear-to-br from-purple-500/40 via-transparent to-purple-500/40 p-px transition duration-300 hover:from-purple-500/60 hover:to-purple-500/60">
                                                <div className="relative rounded-3xl bg-black/80 p-6 md:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">

                                                    <div className={`flex items-center gap-4 ${isEven ? "flex-row-reverse" : "flex-row"}`}>
                                                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 ${isEven ? "" : " md:mr-4"}`}>
                                                            <stage.icon size={24} />
                                                        </div>
                                                        <h3 className="heading-font text-2xl md:text-3xl font-semibold text-white mb-3">
                                                            {stage.title}
                                                        </h3>
                                                    </div>

                                                    <p className="text-base md:text-lg text-white/80">
                                                        {stage.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Center Timeline Bullet */}
                                        <div className="md:col-span-2 flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                                            <div className="relative rounded-full bg-linear-to-br from-purple-500/40 via-transparent to-purple-500/40 p-px">
                                                <div className="relative rounded-full bg-black/80 backdrop-blur w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-[0_25px_70px_rgba(0,0,0,0.55)] border-2 border-purple-500/30">
                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                        {/* <stage.icon size={20} className="text-purple-400" /> */}
                                                        <span className="heading-font text-sm md:text-lg font-bold text-white">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Empty space for alternating layout */}
                                        <div className={`hidden md:block md:col-span-5 ${isEven ? "md:col-start-8" : "md:col-start-1"}`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Text */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                        Each stage is outcome-driven — you focus on building, we ensure you're supported.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default MslJourneySection;

