import { atom, useAtom, useAtomValue } from "jotai";
import { useLayoutEffect } from "react";

const planAtom = atom<any>(null);

export function useRegisterPlan(initialPlan) {
  const [plan, setPlan] = useAtom(planAtom);

  useLayoutEffect(() => {
    setPlan(initialPlan);
    return () => {
      setPlan(null);
    };
  }, [initialPlan]);

  const isReady = Boolean(plan);
  return isReady;
}

export function usePlan() {
  return useAtomValue(planAtom);
}

export function usePlanComponents() {
  return usePlan().canvas.canvasData;
}

/* ========== Selections ========== */

export type SelectedObject =
  /* add other types */
  { type: "room"; index: number };

const selectedObjectAtom = atom<SelectedObject | null>(null);

export function useSelectedObject() {
  return useAtom(selectedObjectAtom);
}


