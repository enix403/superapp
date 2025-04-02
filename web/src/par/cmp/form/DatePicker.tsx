import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useMaybeControlled } from "@/hooks/useMaybeControlled";

function toUTCISO(date: Date): string {
  return format(date, "yyyy-MM-dd'T'00:00:00'Z'");
}

// TODO: receive and forward more props to react-day-picker
export function DatePicker({
  defaultValue,
  value,
  onChange
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (val: string | undefined) => void;
}) {
  const [dateISO, setDateISO] = useMaybeControlled<string | undefined>({
    defaultValue,
    value,
    onChange
  });

  const date = new Date(dateISO ?? "invalid");
  // https://stackoverflow.com/a/1353711
  // @ts-ignore
  const isDateValid = !isNaN(date);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        {/* <FormControl> */}
        <Button
          variant={"outline"}
          className={cn(
            "pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {isDateValid ? format(date, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
        </Button>
        {/* </FormControl> */}
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={isDateValid ? date : undefined}
          onSelect={(newDate: Date | undefined) => {
            setDateISO(newDate ? toUTCISO(newDate) : undefined);
          }}
          // disabled={date => date > new Date() || date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
