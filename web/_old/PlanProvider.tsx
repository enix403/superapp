import { createContext, useContext } from "react";
import { StateSet } from "@/lib/utils";
import { memo, PropsWithChildren, useMemo } from "react";
import { useInitState } from "@/hooks/useInitState";
import { buildInitPlan, PlanInfo, PlanComponents } from "./build-plan";

export interface IPlanContext {
  planInfo: PlanInfo;
  planComponents: PlanComponents;

  // setPlanInfo: StateSet<PlanInfo>;
  setPlanComponents: StateSet<PlanComponents>;
}

const PlanContext = createContext<IPlanContext | null>(null);

export const PlanProvider = memo(
  ({ plan: serverPlan, children }: { plan: any } & PropsWithChildren) => {
    const initPlan = useMemo(() => buildInitPlan(serverPlan), [serverPlan]);

    const [planInfo, setPlanInfo] = useInitState(initPlan.planInfo);
    const [planComponents, setPlanComponents] = useInitState(
      initPlan.planComponents
    );

    const context = useMemo(
      () =>
        ({
          planInfo,
          planComponents,
          setPlanComponents
        }) as IPlanContext,
      [initPlan]
    );

    return (
      <PlanContext.Provider value={context}>{children}</PlanContext.Provider>
    );
  }
);

/* ============================ */

function usePlan() {
  return useContext(PlanContext)!;
}

export function usePlanInfo() {
  return usePlan().planInfo;
}

export function usePlanComponents() {
  return usePlan().planComponents;
}

export function useSetPlanComponents() {
  return usePlan().setPlanComponents;
}