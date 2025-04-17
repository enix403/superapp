
import { format } from "date-fns";
import { ParamVoidCallback } from "@/lib/utils";
import { useMappedState } from "./useMappedState";

export const ADAPTER_FORMAT_DATE_ONLY = "yyyy-MM-dd'T'00:00:00'Z'";

export function useDateToStringAdapter(
  dateString: string | undefined,
  setDateString: ParamVoidCallback<string | undefined>,
  stringFormat: string
) {
  const [date, setDate] = useMappedState(
    dateString,
    setDateString,
    dateString => new Date(dateString ?? "invalid") as Date | undefined,
    date => (date ? format(date, stringFormat) : undefined)
  );
  // https://stackoverflow.com/a/1353711
  // @ts-ignore
  const isDateValid = !isNaN(date);

  return [date, setDate, isDateValid] as const;
}