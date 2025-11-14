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
        { id: 2, title: "About", href: "/about" },
        { id: 3, title: "Our Startups", href: "/our-startups" },
        { id: 4, title: "Contact", href: "/contact" },
    ];

    return (
        <div
            className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
        >
            <div
                className={cn(
                    "mx-auto flex justify-between items-center transition-all duration-300 border-2",
                    isScrolled ? 
                        "w-[80%] mt-2 px-4 rounded-full backdrop-blur-md bg-white/5"
                        : "w-[90%]",
                        isScrolled ? "border-white/10" : "border-transparent"

                )}
            >
                <Image
                    src="/logo_bg.png"
                    alt="logo"
                    width={150}
                    height={100}
                    className='h-16 object-contain'
                />

                <div className='flex justify-between items-center gap-10'>
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