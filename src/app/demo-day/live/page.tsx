"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ThumbsUp, ThumbsDown, CalendarCheck, LogOut, MapPin, Check, X, Linkedin } from "lucide-react";
import { socket } from "@/lib/socket";

const API_BASE = process.env.NEXT_PUBLIC_DEMO_DAY_API_URL || "https://careers-crm-backend.mesaschool.co.in";

interface VCData {
  _id: string;
  name: string;
  email: string;
  profile_pic: string;
  company: string;
  designation: string;
}

interface Founder {
  name: string;
  designation: string;
  email: string;
  founder_profile_pic: string;
  linkedin: string;
}

interface Startup {
  _id: string;
  startup_name: string;
  startup_summary: string;
  company_logo: string;
  founder: Founder[];
  sector: { name: string };
  ask_amount: string;
  pitch_deck_url: string;
  company_header_image: string;
  location: string;
  cohort: string;
}

export default function DemoDayLivePage() {
  const router = useRouter();
  const [vc, setVc] = useState<VCData | null>(null);
  const [currentStartup, setCurrentStartup] = useState<Startup | null>(null);
  const [vote, setVote] = useState<string | null>(null);
  const [bookMeeting, setBookMeeting] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPitch, setLoadingPitch] = useState(true);

  useEffect(() => {
    const vcCookie = Cookies.get("demo_day_vc");
    if (!vcCookie) {
      router.replace("/demo-day/on-boarding");
      return;
    }
    try {
      const parsed = JSON.parse(vcCookie);
      setVc(parsed);
    } catch {
      Cookies.remove("demo_day_vc");
      router.replace("/demo-day/on-boarding");
    }
  }, [router]);

  const latestRequestRef = useRef(0);

  const fetchActivePitch = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    try {
      const res = await fetch(`${API_BASE}/api/demo-day-vc/active-pitch`);
      const result = await res.json();
      if (requestId !== latestRequestRef.current) return; // stale response
      if (result.success && result.data) {
        setCurrentStartup(result.data);
      } else {
        setCurrentStartup(null);
      }
    } catch (err) {
      console.error("Failed to fetch active pitch:", err);
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoadingPitch(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!vc?._id) return;
    socket.emit("vc_join", { vc_id: vc._id });
    fetchActivePitch();

    const onPitchStart = (data: { startup_id?: string; startup_name?: string } = {}) => {
      console.log("[Socket] pitch_start received:", data);
      setVote(null);
      setBookMeeting(null);
      setLoadingPitch(true);
      fetchActivePitch();
    };

    const onPitchEnd = () => {
      console.log("[Socket] pitch_end received");
      latestRequestRef.current++;
      setCurrentStartup(null);
      setVote(null);
      setBookMeeting(null);
      setLoadingPitch(false);
    };

    socket.on("pitch_start", onPitchStart);
    socket.on("pitch_end", onPitchEnd);

    return () => {
      socket.off("pitch_start", onPitchStart);
      socket.off("pitch_end", onPitchEnd);
    };
  }, [vc, fetchActivePitch]);

  const sendVote = async (consent: string, meeting: boolean | null) => {
    if (!vc?._id || !currentStartup?._id) return;
    const feedback = meeting === true
      ? "Meeting requested"
      : meeting === false
        ? "No meeting"
        : undefined;

    await fetch(`${API_BASE}/api/demo-day-vc/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vc_id: vc._id,
        startup_id: currentStartup._id,
        consent,
        ...(feedback && { feedback }),
      }),
    });
  };

  const castVote = async (consent: string) => {
    if (!vc?._id || !currentStartup?._id || submitting) return;
    setSubmitting(true);
    try {
      await sendVote(consent, bookMeeting);
      setVote(consent);
    } catch (err) {
      console.error("Failed to cast vote:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookMeeting = async (wantsMeeting: boolean) => {
    setBookMeeting(wantsMeeting);
    if (vote) {
      try {
        await sendVote(vote, wantsMeeting);
      } catch (err) {
        console.error("Failed to update meeting preference:", err);
      }
    }
  };

  if (!vc) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#060e0b]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#060e0b]">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#0f5a45_0%,transparent_50%)] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#0a3528_0%,transparent_50%)] pointer-events-none opacity-30" />

      {/* Logo */}
      <div className="absolute top-4 left-5 z-30 sm:top-6 sm:left-8">
        <Image src="/logo-mesa.png" alt="MSL Logo" width={120} height={48} className="object-contain sm:w-[130px]" priority />
      </div>

      {/* VC Identity */}
      <div className="absolute top-4 right-5 z-30 sm:top-6 sm:right-8 flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2">
          {vc.profile_pic ? (
            <img src={vc.profile_pic} alt={vc.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold text-emerald-300">
              {vc.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-white/70">{vc.name}</span>
        </div>
        <button
          onClick={() => {
            Cookies.remove("demo_day_vc");
            router.replace("/demo-day/on-boarding");
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white/40 transition-colors hover:text-white/70 hover:bg-black/60"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-dvh items-center justify-center px-4 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          {loadingPitch ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <p className="text-sm text-white/40">Loading pitch...</p>
            </motion.div>
          ) : !currentStartup ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center gap-6 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <Clock className="h-10 w-10 text-emerald-400/60" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Waiting for Next Pitch</h2>
                <p className="mt-2 text-sm sm:text-base text-white/40">
                  The next startup will appear here when the admin starts the pitch.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-300/70">Connected &amp; listening</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentStartup._id}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-6xl"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/8 shadow-[0_25px_100px_-20px_rgba(0,0,0,0.6)] bg-linear-to-br from-[#0c1f1a] via-[#091414] to-[#0a1a16]">

                {/* Subtle emerald glow */}
                <div className="absolute top-0 left-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_left,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none z-1" />

                <div className="relative z-10 flex flex-col lg:flex-row">

                  {/* Left - Startup Info */}
                  <div className="flex-1 p-7 sm:p-9 lg:p-10 flex flex-col min-w-0">
                    <div className="flex items-center gap-5">
                      {currentStartup.company_logo ? (
                        <div className="relative bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] shrink-0 ring-2 ring-white/15">
                          <img
                            src={currentStartup.company_logo}
                            alt={currentStartup.startup_name}
                            className="w-full h-full object-cover p-2.5"
                          />
                        </div>
                      ) : (
                        <div className="flex w-20 h-20 sm:w-24 sm:h-24 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-700/60 to-emerald-900/60 text-3xl font-bold text-emerald-300 ring-2 ring-emerald-500/20 shrink-0 shadow-lg">
                          {currentStartup.startup_name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pb-1">
                        <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                          {currentStartup.startup_name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {currentStartup.sector?.name && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/25 px-3 py-1 text-xs font-medium text-emerald-300">
                              {currentStartup.sector.name}
                            </span>
                          )}
                          {currentStartup.location && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                              <MapPin className="h-3 w-3" />
                              {currentStartup.location}
                            </span>
                          )}
                          {/* {currentStartup.cohort && (
                            <span className="inline-flex items-center rounded-full bg-white/8 border border-white/10 px-3 py-1 text-xs text-white/60">
                              {currentStartup.cohort}
                            </span>
                          )} */}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    {currentStartup.startup_summary && (
                      <div
                        className="mt-5 text-[0.9rem] text-gray-300/80 leading-relaxed line-clamp-3 [&_p]:mb-1.5 last:[&_p]:mb-0"
                        dangerouslySetInnerHTML={{ __html: currentStartup.startup_summary }}
                      />
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Founders - row with name below image */}
                    {currentStartup.founder?.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-white/6">
                        <div className="flex items-start gap-8">
                          {currentStartup.founder.map((f, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                              {f.founder_profile_pic ? (
                                <div className="relative shrink-0">
                                  <img
                                    src={f.founder_profile_pic}
                                    alt={f.name}
                                    className="w-20 h-20 rounded-full object-cover ring-2 ring-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                                  />
                                  {f.linkedin && (
                                    <a
                                      href={f.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A66C2] ring-2 ring-black/50 hover:scale-110 transition-transform"
                                    >
                                      <Linkedin className="h-2.5 w-2.5 text-white" />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <div className="flex w-20 h-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-700/50 to-emerald-900/50 text-lg font-bold text-emerald-300 ring-2 ring-white/15 shrink-0 shadow-lg">
                                  {f.name.charAt(0)}
                                </div>
                              )}
                              <p className="text-sm font-semibold text-white mt-2.5 leading-tight">{f.name}</p>
                              {f.designation && (
                                <p className="text-xs text-white/40 leading-tight mt-0.5">{f.designation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right - Actions panel with frosted glass */}
                  <div className="lg:w-[310px] xl:w-[330px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/8 bg-black/20 backdrop-blur-xl p-7 sm:p-8 lg:p-9 flex flex-col justify-center gap-7">
                    {/* Vote Section */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                        <h3 className="text-[0.7rem] font-bold text-white/45 uppercase tracking-[0.18em]">Cast Your Vote</h3>
                      </div>
                      {!vote ? (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => castVote("yes")}
                            disabled={submitting}
                            className="group relative flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer overflow-hidden border border-emerald-500/30 text-emerald-300 hover:border-emerald-400/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.12),inset_0_1px_0_rgba(255,255,255,0.05)]"
                          >
                            <div className="absolute inset-0 bg-linear-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-600/5" />
                            <div className="absolute inset-0 bg-linear-to-b from-white/3 to-transparent" />
                            <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {submitting ? (
                              <div className="h-[1.1rem] w-[1.1rem] animate-spin rounded-full border-2 border-emerald-300 border-t-transparent relative z-10" />
                            ) : (
                              <ThumbsUp className="h-[1.1rem] w-[1.1rem] relative z-10" />
                            )}
                            <span className="relative z-10">{submitting ? "Submitting..." : "Yes, I\u0027m Interested"}</span>
                          </button>
                          <button
                            onClick={() => castVote("no")}
                            disabled={submitting}
                            className="group relative flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer overflow-hidden border border-red-500/20 text-red-300/70 hover:border-red-400/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:shadow-[0_0_30px_rgba(239,68,68,0.08),inset_0_1px_0_rgba(255,255,255,0.03)]"
                          >
                            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-red-500/5 to-transparent" />
                            <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent" />
                            <div className="absolute inset-0 bg-linear-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {submitting ? (
                              <div className="h-[1.1rem] w-[1.1rem] animate-spin rounded-full border-2 border-red-300/70 border-t-transparent relative z-10" />
                            ) : (
                              <ThumbsDown className="h-[1.1rem] w-[1.1rem] relative z-10" />
                            )}
                            <span className="relative z-10">{submitting ? "Submitting..." : "Pass"}</span>
                          </button>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`flex items-center gap-4 rounded-2xl px-5 py-4 backdrop-blur-sm ${
                            vote === "yes"
                              ? "bg-emerald-500/10 border border-emerald-500/25"
                              : "bg-red-500/10 border border-red-500/20"
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                            vote === "yes" ? "bg-emerald-500/25" : "bg-red-500/20"
                          }`}>
                            {vote === "yes" ? (
                              <Check className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <X className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${vote === "yes" ? "text-emerald-300" : "text-red-300/80"}`}>
                              {vote === "yes" ? "Voted Yes!" : "Passed"}
                            </p>
                            <button
                              onClick={() => { setVote(null); setBookMeeting(null); }}
                              className="text-xs text-white/25 hover:text-white/50 transition-colors mt-0.5"
                            >
                              Change vote
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                    {/* Book Meeting Section */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                        <h3 className="text-[0.7rem] font-bold text-white/45 uppercase tracking-[0.18em]">Book a Meeting</h3>
                      </div>
                      {bookMeeting === null ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleBookMeeting(true)}
                            className="group flex-1 relative flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer overflow-hidden border border-white/12 text-white/70 hover:border-white/20 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                          >
                            <div className="absolute inset-0 bg-white/4" />
                            <div className="absolute inset-0 bg-linear-to-b from-white/3 to-transparent" />
                            <CalendarCheck className="h-4 w-4 relative z-10" />
                            <span className="relative z-10">Yes</span>
                          </button>
                          <button
                            onClick={() => handleBookMeeting(false)}
                            className="group flex-1 relative flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer overflow-hidden border border-white/[0.07] text-white/40 hover:border-white/15 hover:text-white/60"
                          >
                            <div className="absolute inset-0 bg-white/2" />
                            <span className="relative z-10">No Thanks</span>
                          </button>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`flex items-center gap-4 rounded-2xl px-5 py-4 backdrop-blur-sm ${
                            bookMeeting
                              ? "bg-emerald-500/8 border border-emerald-500/20"
                              : "bg-white/3 border border-white/[0.07]"
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                            bookMeeting ? "bg-emerald-500/20" : "bg-white/5"
                          }`}>
                            <CalendarCheck className={`h-5 w-5 ${bookMeeting ? "text-emerald-400" : "text-white/30"}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${bookMeeting ? "text-emerald-300" : "text-white/50"}`}>
                              {bookMeeting ? "Meeting Requested" : "No Meeting"}
                            </p>
                            <button
                              onClick={() => setBookMeeting(null)}
                              className="text-xs text-white/25 hover:text-white/50 transition-colors mt-0.5"
                            >
                              Change
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
