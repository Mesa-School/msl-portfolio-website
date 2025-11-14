import React from 'react'
import MenuHeader from './MenuHeader'
import Image from 'next/image'
import Link from 'next/link'

const NavbarMainSection = () => {
    return (
        <div className='w-full'>
            <div className='w-[90%] mx-auto flex justify-between items-center'>
                <div>
                    <Image
                        src="/msl_logo.jpg"
                        alt="logo"
                        width={150}
                        height={100}
                        className='h-20 object-contain'
                    />
                </div>

                <div className='flex justify-between items-center gap-10'>
                    <Link
                        href="/"
                        className='text-white text-2xl font-medium transition-colors duration-200 hover:text-purple-400'
                    >
                        Home
                    </Link>

                    <Link
                        href="/about"
                        className='text-white text-2xl font-medium transition-colors duration-200 hover:text-purple-400'
                    >
                        About
                    </Link>

                    <Link
                        href="/contact"
                        className='text-white text-2xl font-medium transition-colors duration-200 hover:text-purple-400'
                    >
                        Contact
                    </Link>
                </div>
                <MenuHeader />

            </div>
        </div>
    )
}

export default NavbarMainSection;