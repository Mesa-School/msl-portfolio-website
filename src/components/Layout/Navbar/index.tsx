"use client";
import React, { useState, useEffect, useRef } from 'react'
import MenuHeader from './MenuHeader'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavbarMainSection = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const isIgniteRoute = pathname?.startsWith('/ignite') ?? false;

    const logoHref = isIgniteRoute
        ? '/ignite'
        : pathname?.startsWith('/portfolio')
            ? '/portfolio'
            : '/';

    const isDetailPage = /^\/(portfolio|ignite)\/[^/]+$/.test(pathname ?? '');
    const backLabel = isIgniteRoute ? 'Back to Ignite' : 'Back to startups';

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
            className={cn(
                "fixed top-0 left-0 z-50 w-full transition-all duration-300",
                isIgniteRoute && "theme-ignite"
            )}
        >
            {/* Tagline Header - Hidden on scroll */}
            <div
                className={cn(
                    "w-full bg-msl-card backdrop-blur-sm transition-all duration-300 overflow-hidden",
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

                    <div className="flex items-center gap-2 sm:gap-3">
                        {isDetailPage && (
                            <Link
                                href={logoHref}
                                aria-label={backLabel}
                                className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/8 backdrop-blur-md border border-white/10 pl-2 pr-3 sm:pl-2.5 sm:pr-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-white/75 transition-colors duration-300 hover:bg-white/15 hover:border-white/20 hover:text-white"
                            >
                                <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                                    <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                                </span>
                                <span className="hidden sm:inline">{backLabel}</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                        )}

                        <Link
                            href={logoHref}
                            aria-label={isDetailPage ? 'Back to listing' : 'Home'}
                            className="inline-flex items-center"
                        >
                            <Image
                                src="/logo-mesa.png"
                                alt="logo"
                                width={150}
                                height={100}
                                className='h-10 md:h-12 w-auto object-contain rounded-md'
                            />
                        </Link>
                    </div>


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