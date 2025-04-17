import AnimatedNumberCountdown from "@/components/ui/animated-number-countdown";
import AnimatedNumberRandom from "@/components/ui/animated-number-random";
import { CardCarousel } from "@/components/ui/card-carousel";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";
import { Home, Bell, Settings, HelpCircle, Shield, User } from "lucide-react";
import { useRef, useState } from "react";
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle
} from "@/components/ui/minimal-card";
import { AsyncSelect } from "@/components/ui/async-select";
import { apiRoutes } from "@/lib/api-routes";
import { BookmarkButton } from "@/components/ui/icon-button/bookmark-icon-button";

import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker/time-picker-input";
import { TimePeriodSelect } from "@/components/ui/time-picker/period-select";
import { Period } from "@/components/ui/time-picker/time-picker-utils";
import {
  ADAPTER_FORMAT_FULL_ISO,
  ADAPTER_FORMAT_TIME_ONLY
} from "@/hooks/useDateToStringAdapter";
import { useDateTimeInputState } from "@/hooks/useDateInputState";

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

function Demo() {
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

interface TimePickerDemoProps {
  // date: Date | undefined;
  // setDate: (date: Date | undefined) => void;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string | undefined) => void;
}

function TimePicker12Demo({
  defaultValue = "0000-01-01T06:00:00Z",
  value,
  onChange
}: TimePickerDemoProps) {
  const [period, setPeriod] = useState<Period>("PM");

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  const [date, setDate, isDateValid] = useDateTimeInputState({
    defaultValue,
    value,
    onChange,
    // stringFormat: ADAPTER_FORMAT_TIME_ONLY
    stringFormat: date => date?.toISOString()
  });

  return (
    <div className='flex items-end gap-2'>
      <div className='grid gap-1 text-center'>
        <Label htmlFor='hours' className='text-xs'>
          Hours
        </Label>
        <TimePickerInput
          picker='12hours'
          period={period}
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className='grid gap-1 text-center'>
        <Label htmlFor='minutes' className='text-xs'>
          Minutes
        </Label>
        <TimePickerInput
          picker='minutes'
          id='minutes12'
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <div className='grid gap-1 text-center'>
        <Label htmlFor='seconds' className='text-xs'>
          Seconds
        </Label>
        <TimePickerInput
          picker='seconds'
          id='seconds12'
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>
      <div className='grid gap-1 text-center'>
        <Label htmlFor='period' className='text-xs'>
          Period
        </Label>
        <TimePeriodSelect
          period={period}
          setPeriod={setPeriod}
          date={date}
          setDate={setDate}
          ref={periodRef}
          onLeftFocus={() => secondRef.current?.focus()}
        />
      </div>
    </div>
  );
}

export function Scratch() {
  // const [date, setDate] = useState<Date | undefined>(() => new Date());
  return (
    <div className='pb-40'>
      <TimePicker12Demo />
      <br />
      <div>
        <BookmarkButton />
      </div>
      <br />
      <br />
      <Demo />
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
