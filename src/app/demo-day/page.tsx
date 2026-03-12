"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface VCData {
    _id: string;
    name: string;
    email: string;
    profile_pic: string;
    company: string;
    designation: string;
};

export default function DemoDayPage() {
    const router = useRouter();
    const [vc, setVc] = useState<VCData | null>(null);
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        const vcCookie = Cookies.get("demo_day_vc");
        if (!vcCookie) {
            router.replace("/demo-day/on-boarding");
            return;
        }
        try {
            setVc(JSON.parse(vcCookie));
        } catch {
            Cookies.remove("demo_day_vc");
            router.replace("/demo-day/on-boarding");
        }
    }, [router]);

    if (!vc) {
        return (
            <div className="flex h-screen items-center justify-center bg-linear-to-b from-[#0a4d3c] via-[#0a3d31] to-black">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            </div>
        );
    };

    return (
        <div
            className="relative h-screen w-full overflow-hidden bg-linear-to-b from-[#0a4d3c] via-[#0a3d31] to-black"
        >

            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </div>

            {/* Background Graphic */}
            <motion.div
                className="absolute inset-0 flex items-end justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.07, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
            >
                <Image
                    src="/graphic.png"
                    alt=""
                    width={1400}
                    height={700}
                    className="w-full max-w-7xl h-auto object-contain"
                    priority
                />
            </motion.div>

            {/* Logo - Top Left */}
            <motion.div
                className="absolute top-6 left-8 z-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Image
                    src="/logo-mesa.png"
                    alt="MSL Logo"
                    width={140}
                    height={56}
                    className="object-contain"
                    priority
                />
            </motion.div>

            {/* Main Content */}
            <div
                className="relative z-10 flex h-screen flex-col items-center justify-center px-6"
            >
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    {/* Heading */}
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
                            MSL Demo Day
                        </h1>
                        {/* <p className="text-lg sm:text-xl text-white/50">
              Mesa x WaterBridge Ventures
            </p> */}
                    </motion.div>

                    {/* VC Identity Card */}
                    <motion.div
                        className="flex items-center gap-5 mx-auto w-fit rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md px-7 py-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        {vc.profile_pic ? (
                            <img
                                src={vc.profile_pic}
                                alt={vc.name}
                                className="h-16 w-16 rounded-xl object-cover ring-2 ring-white/10"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-900/40 text-2xl font-bold text-emerald-300 ring-2 ring-white/10">
                                {vc.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="text-left">
                            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Welcome back</p>
                            <h2 className="text-xl font-semibold text-white">{vc.name}</h2>
                            {(vc.designation || vc.company) && (
                                <p className="text-sm text-white/40">
                                    {[vc.designation, vc.company].filter(Boolean).join(", ")}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Subtitle */}
                    {/* <motion.p
            className="text-base text-white/40 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Your journey starts here. Manage your virtual cash, invest in teams, and climb the leaderboard.
          </motion.p> */}

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <button
                            onClick={() => { setNavigating(true); router.push("/demo-day/live"); }}
                            disabled={navigating}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {navigating ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    Get Started
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Switch Identity */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                    >
                        <button
                            onClick={() => {
                                Cookies.remove("demo_day_vc");
                                router.replace("/demo-day/on-boarding");
                            }}
                            className="text-sm text-white/25 transition-colors hover:text-white/60"
                        >
                            Not you? Switch identity
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
