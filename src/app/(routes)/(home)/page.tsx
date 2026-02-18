'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/maintenance');
  }, [router]);

  return null;
}

// return (
//   <div className="">
//     <HeroSection />
//     <StatsSection />
//     <WhyMslSection />
//     <MslJourneySection />
//     <WhatYouGetSection />
//     <SuccessStoriesSection />
//     {/* <StartupLogosSection /> */}
//     {/* <MeetOurTeam /> */}
//   </div>
// );