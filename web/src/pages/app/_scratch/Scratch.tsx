import AnimatedNumberCountdown from "@/components/ui/animated-number-countdown";
import AnimatedNumberRandom from "@/components/ui/animated-number-random";
import { CardCarousel } from "@/components/ui/card-carousel";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";
import { Home, Bell, Settings, HelpCircle, Shield, User } from "lucide-react";
import { useState } from "react";

const tabs = [
  { title: "Dashboard", icon: Home },
  { title: "Notifications", icon: Bell },
  { type: "separator" as const },
  { title: "Settings", icon: Settings },
  { title: "Support", icon: HelpCircle },
  { title: "Security", icon: Shield }
];

export function TabsDemo() {
  return (
    <div>
      <ExpandedTabs
        activeColor='text-black'
        className='w-auto max-w-96'
        tabs={tabs}
      />
    </div>
  );
}

function CardsCarouselDemo() {
  const images = [
    { src: "https://skiper-ui.com/card/1.png", alt: "Image 1" },
    { src: "https://skiper-ui.com/card/2.png", alt: "Image 2" },
    { src: "https://skiper-ui.com/card/3.png", alt: "Image 3" },
  ]

  return (
    <div className="pt-4">
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  )
}

export function Scratch() {
  return (
    <div className="pb-40">
      <TabsDemo />
      <AnimatedNumberRandom value={490} diff={0} />
      <AnimatedNumberCountdown endDate={new Date("2025-12-31")} />
      <CardsCarouselDemo />
    </div>
  );
}
