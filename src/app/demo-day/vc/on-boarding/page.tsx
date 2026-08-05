"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { VC_Data } from "@/data/vc_data";

interface VCData {
  _id: string;
  name: string;
  email: string;
  profile_pic: string;
  company: string;
  designation: string;
  phone: string;
  notes: string;
  is_active: boolean;
}

interface VCResponse {
  success: boolean;
  data: VCData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_DEMO_DAY_API_URL || "https://careers-crm-backend.mesaschool.co.in";

export default function DemoDayOnboardingPage() {
  const router = useRouter();
  const [vcs, setVcs] = useState<VCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  const fetchVCs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        is_active: "true",
      });

      const res = await fetch(`${API_BASE}/api/demo-day-vc/vcs?${params}`);
      const data: VCResponse = await res.json();

      if (data.success) {
        setVcs(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch VCs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVCs();
  }, [fetchVCs]);

  const handleSelect = (name: string) => {
    setSelectedName((prev) => (prev === name ? null : name));
  };

  const handleContinue = () => {
    if (!selectedName || navigating) return;
    setNavigating(true);

    const vc = vcs.find(
      (v) => v.name.toLowerCase() === selectedName.toLowerCase()
    );

    if (vc) {
      Cookies.set(
        "demo_day_vc",
        JSON.stringify({
          _id: vc._id,
          name: vc.name,
          email: vc.email,
          profile_pic: vc.profile_pic,
          company: vc.company,
          designation: vc.designation,
        }),
        { expires: 1 }
      );
    } else {
      Cookies.set(
        "demo_day_vc",
        JSON.stringify({ name: selectedName }),
        { expires: 1 }
      );
    }

    router.push("/demo-day/vc");
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0b3d30]">
      {/* Radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0f5a45_0%,#0b3d30_50%,#071f1a_100%)] pointer-events-none" />

      {/* Graphic - subtle corner decoration */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
        <Image src="/graphic.png" alt="" width={500} height={350} className="object-contain" priority />
      </div>

      {/* Logo */}
      <motion.div
        className="absolute top-4 left-5 z-20 sm:top-6 sm:left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image src="/logo-mesa.png" alt="MSL Logo" width={120} height={48} className="object-contain sm:w-[130px]" priority />
      </motion.div>

      {/* Full layout */}
      <div className="relative z-10 flex flex-col items-center px-6 sm:px-10 lg:px-16 sm:pt-20 pb-10 sm:pb-16">
        {/* Header */}
        <motion.div
          className="text-center mb-5 sm:mb-8 shrink-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            MSL Demo Day
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/35">
            Choose your profile to get started
          </p>
        </motion.div>

        {/* Cards - centered in remaining space */}
        <div className="flex-1 min-h-0 mt-0 flex items-center justify-center w-full">
          {loading ? (
            <div className="w-full max-w-2xl lg:max-w-3xl flex flex-col gap-2 sm:gap-3 h-full max-h-full justify-center">
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {VC_Data.slice(0, 4).map((_, i) => (
                  <div key={i} className="aspect-3/4 animate-pulse rounded-lg sm:rounded-xl bg-white/10" />
                ))}
              </div>
              <div className="flex justify-center gap-2 sm:gap-3">
                {VC_Data.slice(4).map((_, i) => (
                  <div key={i} className="w-[calc(25%-6px)] aspect-3/4 animate-pulse rounded-lg sm:rounded-xl bg-white/10" />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              className="w-full max-w-2xl lg:max-w-3xl flex flex-col gap-2 sm:gap-3 max-h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              {/* First row - 4 cards */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {VC_Data.slice(0, 4).map((card, index) => {
                  const isSelected = selectedName === card.name;
                  return (
                    <motion.button
                      key={card.id}
                      onClick={() => handleSelect(card.name)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                      className={`group relative rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer ${
                        isSelected ? "scale-105" : "ring-transparent"
                      } ${selectedName && !isSelected ? "opacity-40" : ""}`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white shadow-lg shadow-emerald-500/30"
                          >
                            <Check className="h-2 w-2 sm:h-3 sm:w-3 text-emerald-600" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="overflow-hidden rounded-lg sm:rounded-xl">
                        <Image
                          src={card.image}
                          alt={card.name}
                          width={400}
                          height={500}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            isSelected ? "grayscale-0" : "grayscale hover:grayscale-0"
                          }`}
                          priority
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {/* Second row - remaining cards, centered */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {VC_Data.slice(4).map((card, index) => {
                  const isSelected = selectedName === card.name;
                  return (
                    <motion.button
                      key={card.id}
                      onClick={() => handleSelect(card.name)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 + (index + 4) * 0.05 }}
                      className={`group relative w-[calc(25%-6px)] rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer ${
                        isSelected ? "scale-105" : "ring-transparent"
                      } ${selectedName && !isSelected ? "opacity-40" : ""}`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white shadow-lg shadow-emerald-500/30"
                          >
                            <Check className="h-2 w-2 sm:h-3 sm:w-3 text-emerald-600" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="overflow-hidden rounded-lg sm:rounded-xl">
                        <Image
                          src={card.image}
                          alt={card.name}
                          width={400}
                          height={500}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            isSelected ? "grayscale-0" : "grayscale hover:grayscale-0"
                          }`}
                          priority={false}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Continue Button - bottom right */}
      <AnimatePresence>
        {selectedName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30"
          >
            <button
              onClick={handleContinue}
              disabled={navigating}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-[#0b3d30] shadow-xl shadow-black/20 transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
            >
              {navigating ? (
                <>
                  <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-[#0b3d30] border-t-transparent" />
                  Loading...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
