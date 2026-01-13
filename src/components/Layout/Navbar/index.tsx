"use client";
import React, { useState, useEffect, useRef } from 'react'
import MenuHeader from './MenuHeader'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils';

const NavbarMainSection = () => {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navMenuList = [
        { id: 1, title: "Home", href: "/" },
        { id: 2, title: "About", href: "#why-msl" },
        { id: 3, title: "Portfolio", href: "/portfolio" },
        { id: 4, title: "Contact", href: "#why-msl" },
    ];

    return (
        <div
            className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
        >
            {/* Tagline Header - Hidden on scroll */}
            <div
                className={cn(
                    "w-full bg-[#091414] backdrop-blur-sm transition-all duration-300 overflow-hidden",
                    isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
                )}
            >
                <div className='w-[95%] md:w-[90%] mx-auto py-2 px-4'>
                    <p className="text-white/80 text-xs md:text-base text-center font-medium">
                        The launchpad for India’s next generation of builders
                    </p>
                </div>
            </div>

            {/* Navbar */}
            <div
                className={cn(
                    "mx-auto flex py-2 justify-between items-center transition-all duration-300 border-2",
                    isScrolled ?
                        "backdrop-blur-md bg-white/5 border-b-2 border-white/10"
                        : "",
                    isScrolled ? "border-transparent" : "border-transparent"

                )}
            >
                <div className='w-[95%] md:w-[90%] mx-auto flex justify-between items-center gap-4'>

                    <Link href="/">
                        <Image
                            src="/logo-mesa.png"
                            alt="logo"
                            width={150}
                            height={100}
                            className='h-10 md:h-12 w-auto object-contain rounded-md'
                        />
                    </Link>


                    {/* Nav Links - Center */}
                    {/* <div className='hidden md:flex items-center gap-6 flex-1 justify-center'>
                        <Link 
                            href="/portfolio"
                            className='text-white text-base font-medium transition-colors duration-200 hover:text-purple-400'
                        >
                            Portfolio
                        </Link>
                        <Link 
                            href="#why-msl"
                            className='text-white text-base font-medium transition-colors duration-200 hover:text-purple-400'
                        >
                            Why MSL
                        </Link>
                    </div> */}

                    {/* Right side - Portfolio Button */}
                    {/* <div className="flex items-center gap-4">
                        <Link
                            href="/portfolio"
                            className="heading-font clip-hover relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-6 py-2 text-sm md:text-base font-semibold text-[#27614A] shadow-[0_0_25px_rgba(39,97,74,0.25)] transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_35px_rgba(39,97,74,0.35)]"
                        >
                            <span className='font-black'>Portfolio</span>
                        </Link>
                        <MenuHeader />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default NavbarMainSection;