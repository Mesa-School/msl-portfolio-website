import React from "react";
import HeroSection from "@/components/Home/HeroSection";
import StatsSection from "@/components/Home/StatsSection";
import WhyMslSection from "@/components/Home/WhyMslSection";
import MslJourneySection from "@/components/Home/MslJourneySection";
import WhatYouGetSection from "@/components/Home/WhatYouGetSection";
import SuccessStoriesSection from "@/components/Home/SuccessStoriesSection";
import MeetOurTeam from "@/components/Home/MeetOurTeam";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <StatsSection />
      <WhyMslSection />
      <MslJourneySection />
      <WhatYouGetSection />
      <SuccessStoriesSection />
      {/* <MeetOurTeam /> */}
    </div>
  );
};