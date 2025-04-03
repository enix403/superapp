import { ChangeEvent, ComponentProps, useCallback, useLayoutEffect, useState } from "react";

export function useWatchInput({
  value,
  defaultValue,
  onChange: onChangeProvided
}: Pick<ComponentProps<"input">, "value" | "defaultValue" | "onChange">) {
  const hasValue = typeof value !== "undefined";
  const hasDefaultValue = typeof defaultValue !== "undefined";

  const [watchedValue, setWatchedValue] = useState(
    hasValue ? value : hasDefaultValue ? defaultValue : undefined
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChangeProvided?.(e);
      if (!hasValue) setWatchedValue(e.target.value);
    },
    [onChangeProvided, hasValue]
  );

  useLayoutEffect(() => {
    setWatchedValue(value);
  }, [value]);

  return { value: hasValue ? value : watchedValue, onChange };
}