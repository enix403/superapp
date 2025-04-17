import { useDateToStringAdapter } from "./useDateToStringAdapter";
import { useMaybeControlled } from "./useMaybeControlled";

export function useDateTimeInputState({
  defaultValue,
  value,
  onChange,
  stringFormat
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (val: string | undefined) => void;
  stringFormat: string | ((date: Date | undefined) => string | undefined);
}) {
  const [dateString, setDateString] = useMaybeControlled<string | undefined>({
    defaultValue,
    value,
    onChange
  });

  return useDateToStringAdapter(dateString, setDateString, stringFormat);
}
