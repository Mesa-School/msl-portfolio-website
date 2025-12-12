"use client";

import { motion } from "framer-motion";
import { Lightbulb, Package, DollarSign, Users, Rocket } from "lucide-react";

const MslJourneySection = () => {
    const stages = [
        {
            title: "Idea to Validation",
            bullets: [
                "Find a problem statement to tackle",
                "Align on team",
                "Validate idea"
            ],
            icon: Lightbulb,
        },
        {
            title: "Taking an MVP to market",
            bullets: [
                "Build a minimum viable product",
                "Service real customers, gain early feedback"
            ],
            icon: Package,
        },
        {
            title: "Unlock Investment",
            bullets: [
                "Get access to Mesa's Startup Lab fund",
                "Get introduced to VCs in the network"
            ],
            icon: DollarSign,
        },
        {
            title: "1:1 Mentorship, Coaching",
            bullets: [
                "Stay accountable through mentorship, coaching and domain-specific guidance",
                "Get in-house mentorship & connects to founders & leaders in desired industries"
            ],
            icon: Users,
        },
        {
            title: "Founder Fellowship",
            bullets: [
                "Get extended support for the first 6 months of building"
            ],
            icon: Rocket,
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
                                        {/* Content Card - Alternates left and right (inner content always left-aligned) */}
                                        <div
                                            className={`md:col-span-5 ${isEven
                                                    ? "md:col-start-1 md:pr-8"
                                                    : "md:col-start-8 md:pl-8"
                                                }`}
                                        >
                                            <div className="relative rounded-3xl bg-linear-to-br from-purple-500/40 via-transparent to-purple-500/40 p-px transition duration-300 hover:from-purple-500/60 hover:to-purple-500/60">
                                                <div className="relative rounded-3xl bg-black/80 p-6 md:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">

                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 md:mr-4">
                                                            <stage.icon size={24} />
                                                        </div>
                                                        <h3 className="heading-font text-2xl md:text-3xl font-semibold text-white">
                                                            {stage.title}
                                                        </h3>
                                                    </div>

                                                    <ul className="space-y-2 text-base md:text-lg text-white/80 text-left">
                                                        {stage.bullets.map((bullet, bulletIndex) => (
                                                            <li key={bulletIndex} className="flex items-start">
                                                                <span className="text-purple-400 mr-2">→</span>
                                                                <span>{bullet}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
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

                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Text */}
                {/* <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                        Each stage is outcome-driven — you focus on building, we ensure you're supported.
                    </p>
                </motion.div> */}
            </div>
        </section>
    );
};

export default MslJourneySection;

