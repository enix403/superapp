import { DemoTable } from "@/par/features/datatable/DemoTable";
import { CountrySelect } from "./country-select/CountrySelect";
import { useState } from "react";
import { DatePicker } from "@/par/cmp/form/DatePicker";

export function Scratch() {
  const [value, setValue] = useState<any>("2024-01-16");
  return (
    <div className='max-h-full w-full max-w-full space-y-7 overflow-y-auto p-8'>
      {/* <DatePicker value={value} onChange={setValue} /> */}
      {/* <CountrySelect defaultValue="pk" /> */}
      {/* <DemoTable /> */}
    </div>
  );
}
