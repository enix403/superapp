"use client";

import { useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { countries as allCountries } from "countries-list";
import { hasFlag } from "country-flag-icons";
import * as allFlags from "country-flag-icons/react/3x2";

function useMaybeControlled<T>({
  defaultValue,
  value,
  onChange
}: {
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
}) {

}

export function CountrySelect({
  value: daw,
  onChange
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const countryCodes = useMemo(() => Object.keys(allCountries), []);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]'
        >
          {allCountries[value] ? (
            <span className='flex min-w-0 items-center gap-2'>
              {CountryItemFlag(value)}
              <span className='truncate'>
                {allCountries[value].name} ({value})
              </span>
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
            {countryCodes.map(code => {
              return (
                <CommandItem
                  key={code}
                  value={allCountries[code].name}
                  onSelect={() => {
                    setValue(code);
                    setOpen(false);
                  }}
                  className='rounded-none'
                >
                  {CountryItemFlag(code)}
                  {allCountries[code].name}
                  {value === code && (
                    <CheckIcon size={16} className='ml-auto' />
                  )}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CountryItemFlag(code: string) {
  if (hasFlag(code)) {
    const Flag = allFlags[code];
    return <Flag className='w-6' />;
  }
  return null;
}
