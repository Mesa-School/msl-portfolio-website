"use client";
import { useState, useEffect,useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { backgroundVariants, containerVariants, itemVariants, headingVariants } from "@/utils/animation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {

  const sectionRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      if(!sectionRef.current) return;

      gsap.set(heading1Ref.current,{
        opacity:1,
        y:0,
        scale:1
      });

      gsap.set(heading2Ref.current,{
        opacity:0,
        y:0,
        scale:0.9,
        pointerEvents:"none"
      });

      const t1 = gsap.timeline({
        scrollTrigger:{
          trigger:sectionRef.current,
          start:"top top",
          end:"+=200%",
          scrub:0.5,
          pin:true,
          pinSpacing:true,
          invalidateOnRefresh:true,
          onUpdate:(self)=>{
            console.log("Self Progress: ",self.progress.toFixed(2));
          },
        },
      });

      t1.to(heading1Ref.current,{
        opacity:0,
        y:0,
        scale:0.8,
        duration:1,
        ease:"power2.inOut"
      });

      t1.to(
        heading2Ref.current,
        {
          opacity:1,
          y:0,
          scale:1,
          pointerEvents:"auto",
          duration:1.2,
          ease:"power2.out"
        },
        "+=0.1"
      );

      console.log("Scroll Trigger and animation setup complete");
    }, 500);

    return()=>{
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((trigger)=>trigger.kill());
      console.log("Cleanup Complete ")
    }

  },[]);

  return (
    <section 
      ref={sectionRef} 
      className="relative flex min-h-screen items-center justify-center overflow-hidden text-white"
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      >
        <Image
          src="/background.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay for better text readability - transparent at top to darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90"></div>
      </motion.div>
      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl flex flex-col items-center justify-center gap-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="heading-font text-sm uppercase tracking-[0.4em] text-white font-black md:text-base"
          variants={itemVariants}
        >
          Founder-First Platform
        </motion.p>
        <div className="relative w-full min-h-[15vh]">
          <motion.div
            ref={heading1Ref}
            className="perspective-1000 absolute inset-0 flex items-center justify-center px-4"
            style={{ 
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.h1
              className="heading-font text-3xl font-black text-white md:text-6xl lg:text-7xl transform-gpu"
              variants={headingVariants}
              style={{
                transformStyle: "preserve-3d",
                textShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(168, 85, 247, 0.3), 0 5px 15px rgba(0, 0, 0, 0.8)",
                letterSpacing: "0.02em",
              }}
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                z: 20,
                transition: { duration: 0.3 },
              }}
            >
              Where India's best founders build conviction.
            </motion.h1>
          </motion.div>
          <motion.div
            ref={heading2Ref}
            className="perspective-1000 absolute inset-0 flex items-center justify-center px-4"
            style={{ 
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.h1
              className="heading-font text-3xl font-black text-white md:text-6xl lg:text-7xl transform-gpu"
              variants={headingVariants}
              style={{
                transformStyle: "preserve-3d",
                textShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(168, 85, 247, 0.3), 0 5px 15px rgba(0, 0, 0, 0.8)",
                letterSpacing: "0.02em",
              }}
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                z: 20,
                transition: { duration: 0.3 },
              }}
            >
              Founder-first. India-first. Future-focused.
            </motion.h1>
          </motion.div>
        </div>
        <motion.p
          className="max-w-2xl text-lg text-white/80 md:text-xl"
          variants={itemVariants}
        >
          Founder-first. India-first. Future-focused. We back bold ideas with capital,
          community, and conviction to scale the next generation of category-defining
          companies.
        </motion.p>
        <motion.div
          className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={itemVariants}
        >
          <Link
            href="#contact"
            className="heading-font inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 via-purple-400 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]"
          >
            Our Startups
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;