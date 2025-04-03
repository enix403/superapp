import { useCallback, useState } from "react";

export function useMaybeControlled<T>({
  defaultValue,
  value,
  onChange
}: {
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
}) {
  const isControlled = typeof value !== "undefined";
  const hasDefaultValue = typeof defaultValue !== "undefined";

  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(
    hasDefaultValue ? defaultValue : undefined
  );

  const internalValue = isControlled ? value : uncontrolledValue;

  const setInternalValue = useCallback(
    (val: T) => {
      // When the user types, we will call props.onChange if it exists.
      // We do this even if there is no props.value (and the component
      // is uncontrolled.)
      if (onChange) {
        onChange(val);
      }

      // If the component is uncontrolled, we need to update our
      // uncontrolled value here.
      if (!isControlled) {
        setUncontrolledValue(val);
      }
    },
    [isControlled, onChange]
  );

  return [internalValue, setInternalValue] as const;
}

