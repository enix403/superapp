import { useParams } from "react-router";
import { skipToken, useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api-routes";
import { WebEditorUI } from "./WebEditorUI";

export function WebEditor() {
  const { planId } = useParams();

  const { data: plan, isError } = useQuery({
    queryKey: ["plan", planId],
    queryFn: () => (planId ? apiRoutes.getPlan(planId) : skipToken),
    staleTime: Infinity
  });

  if (!isError && plan)
    return (
      <>
        <WebEditorUI initialPlan={plan} />
      </>
    );

  return "Loading...";
}
