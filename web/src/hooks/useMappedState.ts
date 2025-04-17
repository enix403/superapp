import { ParamVoidCallback } from "@/lib/utils";
import { useCallback } from "react";

export function useMappedState<T, R>(
  value: T,
  setValue: ParamVoidCallback<T>,
  mapFunc: (val: T) => R,
  unmapFunc: (val: R) => T
) {
  const mapped = mapFunc(value);
  const setMapped = useCallback(
    (mapped: R) => {
      setValue(unmapFunc(mapped));
    },
    [unmapFunc, setValue]
  );

  return [mapped, setMapped] as const;
}
