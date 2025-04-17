import AnimatedNumberCountdown from "@/components/ui/animated-number-countdown";
import AnimatedNumberRandom from "@/components/ui/animated-number-random";
import { CardCarousel } from "@/components/ui/card-carousel";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";
import { Home, Bell, Settings, HelpCircle, Shield } from "lucide-react";
import { useState } from "react";
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle
} from "@/components/ui/minimal-card";
import { AsyncSelect } from "@/components/ui/async-select";
import { apiRoutes } from "@/lib/api-routes";
import { BookmarkButton } from "@/components/ui/icon-button/bookmark-icon-button";

const tabs = [
  { title: "Dashboard", icon: Home },
  { title: "Notifications", icon: Bell },
  { type: "separator" as const },
  { title: "Settings", icon: Settings },
  { title: "Support", icon: HelpCircle },
  { title: "Security", icon: Shield }
];

import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { SortableGridDemo } from "./SortableGrid";

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

function AsyncSelectDemo() {
  const [selectedUser, setSelectedUser] = useState<any>();
  return (
    <AsyncSelect<any>
      fetcher={query => apiRoutes.getUsers({ fullName: query })}
      renderOption={user => (
        <div className='flex items-center gap-2'>
          <img
            src={"/profile_img_01.png"}
            alt={user.name}
            width={24}
            height={24}
            className='rounded-full'
          />
          <div className='flex flex-col'>
            <div className='font-medium'>{user.fullName}</div>
            <div className='text-xs text-muted-foreground'>{user.role}</div>
          </div>
        </div>
      )}
      getOptionValue={user => user.id}
      getDisplayValue={user => (
        <div className='flex items-center gap-2'>
          <img
            src={"/profile_img_01.png"}
            alt={user.name}
            width={24}
            height={24}
            className='rounded-full'
          />
          <div className='flex flex-col'>
            <div className='font-medium'>{user.fullName}</div>
          </div>
        </div>
      )}
      notFound={<div className='py-6 text-center text-sm'>No users found</div>}
      label='User'
      placeholder='Search users...'
      value={selectedUser}
      onChange={setSelectedUser}
      width='375px'
    />
  );
}

const date = new Date();

export function MoreComponents() {
  return (
    <div className='pb-40'>
      {/* <div className='max-w-[36rem]'>
        <SortableGridDemo />
      </div> */}
      <br />
      <RelativeTimeCard date={date} />
      <div>
        <BookmarkButton />
      </div>
      <br />
      <br />
      <AsyncSelectDemo />
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
    </div>
  );
}
