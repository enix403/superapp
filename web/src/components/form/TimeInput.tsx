/* // TODO: not usable currently

import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";
import { DateInput, TimeField } from "@/components/ui/datefield-rac";

const pad2 = (num: number) => ("0" + num).slice(-2);

function TimeInput() {
  const [value, setValue] = useState<any>("");

  useEffect(() => {
    if (value) {
      let { hour, minute, second } = value as {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
      };

      let res = `0000-01-01T${pad2(hour)}:${pad2(minute)}:${pad2(second)}Z`;
      console.log(res);
    } else {
      console.log("<empty>");
    }
  }, [value]);

  return (
    <>
      <TimeField value={value} shouldForceLeadingZeros onChange={setValue}>
        <div className='relative'>
          <div className='pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-muted-foreground/80'>
            <ClockIcon size={16} aria-hidden='true' />
          </div>
          <DateInput className='ps-9' />
        </div>
      </TimeField>
    </>
  );
}
 */