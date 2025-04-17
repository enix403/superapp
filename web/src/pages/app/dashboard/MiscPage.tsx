import AnimatedNumberCountdown from "@/components/ui/animated-number-countdown";
import AnimatedNumberRandom from "@/components/ui/animated-number-random";
import { CardCarousel } from "@/components/ui/card-carousel";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";
import { Home, Bell, Settings, HelpCircle, Shield } from "lucide-react";
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle
} from "@/components/ui/minimal-card";
import { BookmarkButton } from "@/components/ui/icon-button/bookmark-icon-button";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { AppLayout } from "@/components/app-layout/AppLayout";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

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
        activeColor='text-foreground'
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
    { src: "https://skiper-ui.com/card/3.png", alt: "Image 3" }
  ];

  return (
    <div className='pt-4'>
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  );
}

const date = new Date();

export function MiscPage() {
  return (
    <AppLayout>
      <div className='pb-40'>
        <RelativeTimeCard date={date} />
        <div>
          <BookmarkButton />
        </div>
        <br />
        <br />
        <TabsDemo />
        <AnimatedNumberRandom value={490} diff={0} />
        <AnimatedNumberCountdown endDate={new Date("2025-12-31")} />
        <CardsCarouselDemo />
        <MinimalCard className='my-4 w-[460px]'>
          <MinimalCardImage
            className='h-[320px]'
            src='https://skiper-ui.com/card/1.png'
          />
          <MinimalCardTitle>{"Sick title"}</MinimalCardTitle>
          <MinimalCardDescription>
            {
              "How to design with gestures and motion that feel intuitive and natural."
            }
          </MinimalCardDescription>
        </MinimalCard>
        <div className='relative mt-4'>
          <HeroVideoDialog
            animationStyle='from-center'
            videoSrc='https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb'
            thumbnailSrc='https://startup-template-sage.vercel.app/hero-light.png'
            thumbnailAlt='Hero Video'
          />
        </div>
      </div>
    </AppLayout>
  );
}
