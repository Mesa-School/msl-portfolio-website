"use client";
import React, { useState, useEffect,useRef } from 'react'
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
        { id: 3, title: "Portfolio", href:"/portfolio" },
        { id: 4, title: "Contact", href: "#why-msl" },
    ];

    return (
        <div
            className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
        >
            <div
                className={cn(
                    "mx-auto flex mt-1 py-2 justify-between items-center transition-all duration-300 border-2",
                    isScrolled ? 
                        "w-[90%] md:w-[85%] mt-2 px-2 md:px-4 rounded-full backdrop-blur-md bg-white/5"
                        : "w-[95%] md:w-[90%",
                        isScrolled ? "border-white/10" : "border-transparent"

                )}
            >
                <Image
                    src="/msl_logo2.png"
                    alt="logo"
                    width={150}
                    height={100}
                    className='h-12 w-auto object-contain rounded-md'
                />

                <div className='justify-between hidden md:flex items-center gap-10'>
                    {navMenuList.map((item) => (
                        <Link 
                            key={item.id} 
                            href={item.href} 
                            className='text-white text-xl font-medium transition-colors duration-200 hover:text-purple-400'
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>

                <MenuHeader />

            </div>
        </div>
    )
}

export default NavbarMainSection;