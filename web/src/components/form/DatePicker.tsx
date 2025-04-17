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
import { useDateToStringAdapter, ADAPTER_FORMAT_DATE_ONLY } from "@/hooks/useDateToStringAdapter";

// onBlur
// TODO: receive and forward more props to react-day-picker
export function DatePicker({
  defaultValue,
  value,
  onChange,
  onBlur,
  disabled
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (val: string | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
}) {
  const [dateISO, setDateISO] = useMaybeControlled<string | undefined>({
    defaultValue,
    value,
    onChange
  });

  const [date, setDate, isDateValid] = useDateToStringAdapter(
    dateISO,
    setDateISO,
    ADAPTER_FORMAT_DATE_ONLY
  );

  return (
    <Popover
      modal
      onOpenChange={open => {
        if (!open) onBlur?.();
      }}
    >
      <PopoverTrigger asChild>
        {/* <FormControl> */}
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {isDateValid ? format(date!, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
        </Button>
        {/* </FormControl> */}
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={isDateValid ? date : undefined}
          onSelect={setDate}
          // onSelect={(newDate: Date | undefined) => {
          // setDateISO(newDate ? toUTCISO(newDate) : undefined);
          // }}
          // disabled={date => date > new Date() || date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
