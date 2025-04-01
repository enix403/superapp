import { Button } from "@/components/ui/button";
import { Redo, Undo } from "lucide-react";
import { TooltipWrapper } from "@/components/TooltipWrapper";

import { UnitControl } from "./controls/UnitControl";
import { FeatureTogglesControl } from "./controls/FeatureTogglesControl";
import { ViewModeControl } from "./controls/ViewModeControl";
import { ZoomControl } from "./controls/ZoomControl";
import { RecenterButton } from "./controls/RecenterButton";

import { World2DEditor } from "./World2DEditor";

function Toolbar() {
  return (
    <nav className='flex border-b px-4 py-2'>
      <div className='flex flex-1 items-center gap-x-1'>
        <UnitControl />
        <FeatureTogglesControl />
        <ViewModeControl />
      </div>
      <div className='flex flex-1 items-center justify-end'>
        <TooltipWrapper tip='Undo'>
          <Button size='icon' variant='ghost'>
            <Undo size={20} />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper tip='Redo'>
          <Button size='icon' variant='ghost'>
            <Redo size={20} />
          </Button>
        </TooltipWrapper>
        <div className='ml-3'>
          <ZoomControl />
        </div>
      </div>
    </nav>
  );
}

export function World2DPane() {
  return (
    <div className='relative flex flex-1-fix flex-col'>
      <Toolbar />
      <div className='flex-1-fix bg-[#F6F6F6]'>
        <World2DEditor />
      </div>
      <div className='absolute bottom-6 left-6'>
        <TooltipWrapper tip='Recenter' side='top'>
          <RecenterButton />
        </TooltipWrapper>
      </div>
    </div>
  );
}
