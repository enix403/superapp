import { format } from "date-fns";
import { ParamVoidCallback } from "@/lib/utils";
import { useMappedState } from "./useMappedState";

export const ADAPTER_FORMAT_DATE_ONLY = "yyyy-MM-dd'T'00:00:00'Z'";
export const ADAPTER_FORMAT_TIME_ONLY = "0000-01-01'T'HH:mm:ss'Z'";
export const ADAPTER_FORMAT_FULL_ISO = "yyyy-MM-dd'T'HH:mm:ss'Z'";

export function useDateToStringAdapter(
  dateString: string | undefined,
  setDateString: ParamVoidCallback<string | undefined>,
  stringFormat: string | ((date: Date | undefined) => string | undefined)
) {
  const [date, setDate] = useMappedState(
    dateString,
    setDateString,
    dateString => new Date(dateString ?? "invalid") as Date | undefined,
    date =>
      date
        ? typeof stringFormat === "function"
          ? stringFormat(date)
          : format(date, stringFormat)
        : undefined
  );
  // https://stackoverflow.com/a/1353711
  // @ts-ignore
  const isDateValid = !isNaN(date);

  return [date, setDate, isDateValid] as const;
}
