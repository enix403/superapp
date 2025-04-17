import { useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker/time-picker-input";
import { TimePeriodSelect } from "@/components/ui/time-picker/period-select";
import { Period } from "@/components/ui/time-picker/time-picker-utils";
import { useDateTimeInputState } from "@/hooks/useDateInputState";

export function TimePicker({
  defaultValue = "0000-01-02T06:00:00Z",
  value,
  onChange
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (val: string | undefined) => void;
}) {
  const [period, setPeriod] = useState<Period>("PM");

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  const [date, setDate, isDateValid] = useDateTimeInputState({
    defaultValue,
    value,
    onChange,
    stringFormat: date => date?.toISOString()
  });

  return (
    <>
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
    </>
  );
}
