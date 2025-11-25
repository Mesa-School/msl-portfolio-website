'use client';

import Image from 'next/image';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Siddharth Chauhan',
    role: 'Head of Mesa Startup Lab',
    bio: 'Leads venture design and founder experience. Ex-Google, Antler.',
    image: '/team/siddharth.jpg',
  },
  {
    name: 'Nazim Hassan',
    role: 'Partnerships at MSL',
    bio: 'Scaled GTM teams at Sequoia-backed startups across APAC.',
    image: '/team/nazim.jpg',
  },
  {
    name: 'Prashika Dua',
    role: 'Program Head at MSL',
    bio: 'Built fintech products at Razorpay and Lightspeed portfolio.',
    image: '/team/prashika.jpg',
  },
  {
    name: 'Gaurav Madan',
    role: 'AI & Tech Generalist',
    bio: 'Entrepreneur & investor championing India-first companies.',
    image: '/team/gaurav.jpg',
  },
];

const MeetOurTeam = () => {
  return (
    <section className="relative overflow-hidden bg-[#05070f] px-4 py-20 text-white sm:px-8 lg:px-16">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#5d5cff]/40 blur-[150px]" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-[#ff5dc8]/25 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
          We&apos;re hiring
        </span>
        <motion.h2
          className="text-4xl font-semibold sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Meet the people building Mesa Startup Lab
        </motion.h2>
        <motion.p
          className="mt-4 max-w-3xl text-lg text-white/70"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          Our team pairs operator experience with deep founder empathy. We stay in the
          trenches with every company that comes through the lab.
        </motion.p>
      </div>

      <div className="relative z-10 mt-12 grid md:w-[80%] mx-auto gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <Tilt
            key={member.name}
            glareEnable
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            className="group h-full"
          >
            <motion.article
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 text-left shadow-[0_40px_120px_rgba(5,7,15,0.65)] transition duration-300 group-hover:border-white/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
            >
              <div className="overflow-hidden rounded-t-2xl">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={320}
                  height={360}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 p-2">
                <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                  {member.role}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">{member.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{member.bio}</p>
              </div>
            </motion.article>
          </Tilt>
        ))}
      </div>
    </section>
  );
};

export default MeetOurTeam;

