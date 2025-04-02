import { DemoTable } from "@/par/features/datatable/DemoTable";
import { CountrySelect } from "./country-select/CountrySelect";
import { useState } from "react";

export function Scratch() {
  return (
    <div className='max-h-full w-full max-w-full space-y-7 overflow-y-auto p-8'>
      <CountrySelect defaultValue="pk" />
    </div>
  );
}
