"use client";

import { Fragment, useId, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

const countries = [
  { value: "United States", flag: "🇺🇸" },
  { value: "Canada", flag: "🇨🇦" },
  { value: "Mexico", flag: "🇲🇽" },
  { value: "South Africa", flag: "🇿🇦" },
  { value: "Nigeria", flag: "🇳🇬" },
  { value: "Morocco", flag: "🇲🇦" },
  { value: "China", flag: "🇨🇳" },
  { value: "Japan", flag: "🇯🇵" },
  { value: "India", flag: "🇮🇳" },
  { value: "United Kingdom", flag: "🇬🇧" },
  { value: "France", flag: "🇫🇷" },
  { value: "Germany", flag: "🇩🇪" },
  { value: "Australia", flag: "🇦🇺" },
  { value: "New Zealand", flag: "🇳🇿" }
];

export function CountrySelect() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]'
        >
          {value ? (
            <span className='flex min-w-0 items-center gap-2'>
              <span className='text-lg leading-none'>
                {countries.find(item => item.value === value)?.flag}
              </span>
              <span className='truncate'>{value}</span>
            </span>
          ) : (
            <span className='text-muted-foreground'>Select country</span>
          )}
          <ChevronDownIcon
            size={16}
            className='shrink-0 text-muted-foreground/80'
            aria-hidden='true'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder='Search country...' />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            {countries.map(country => (
              <CommandItem
                key={country.value}
                value={country.value}
                onSelect={currentValue => {
                  setValue(currentValue);
                  setOpen(false);
                }}
              >
                <span className='text-lg leading-none'>{country.flag}</span>{" "}
                {country.value}
                {value === country.value && (
                  <CheckIcon size={16} className='ml-auto' />
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
