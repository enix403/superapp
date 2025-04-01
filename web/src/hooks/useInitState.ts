import { StateSet } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useInitState<S>(initialState: S | (() => S)): [S, StateSet<S>] {
  const [value, setValue] = useState(initialState);

  useEffect(() => {
    setValue(
      // @ts-ignore
      typeof initialState === "function" ? initialState() : initialState
    );
  }, [initialState]);

  return [value, setValue];
}
