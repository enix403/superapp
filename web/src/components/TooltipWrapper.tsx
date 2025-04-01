import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ComponentProps, PropsWithChildren, ReactNode } from "react";

export function TooltipWrapper({
  children,
  tip,
  side = "bottom"
}: PropsWithChildren & {
  tip: ReactNode;
  side?: ComponentProps<typeof TooltipContent>["side"];
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        className='dark px-2 py-1 text-xs'
        showArrow={true}
      >
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}
