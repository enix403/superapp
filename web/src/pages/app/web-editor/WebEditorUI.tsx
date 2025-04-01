import { useAtomValue } from "jotai";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";

import { TopNav, activeTabAtom } from "./panes/TopNav";
import { RoomList } from "./panes/RoomList";
import { PlotDetails } from "./panes/PlotDetails";
import { RoomDetails } from "./panes/RoomDetails";

import { LayoutViewPane } from "./layout-view/LayoutViewPane";
import { World2DPane } from "./world2d/World2DPane";
import { World3DPane } from "./world3d/World3DPane";
import { useMemo } from "react";
import { useRegisterPlan } from "./plan-state";

function CentralPane() {
  const activeTab = useAtomValue(activeTabAtom);

  if (activeTab === "layout") {
    return <LayoutViewPane />;
  } else if (activeTab === "2d") {
    return <World2DPane />;
  } else if (activeTab === "3d") {
    return <World3DPane />;
  }

  return null;
}

export function WebEditorUI({ initialPlan }: { initialPlan: any }) {
  const isReady = useRegisterPlan(initialPlan);

  if (!isReady) return null;

  return (
    <div className='flex h-full max-h-full flex-col overflow-hidden'>
      <TopNav />
      <ResizablePanelGroup direction='horizontal' className='flex-1-fix'>
        {/* Left Pane */}
        <ResizablePanel minSize={10} defaultSize={18} className='flex flex-col'>
          <RoomList />
          <PlotDetails />
        </ResizablePanel>
        <ResizableHandle />
        {/* Center Pane */}
        <ResizablePanel minSize={40} className='flex flex-1-fix flex-col'>
          <CentralPane />
        </ResizablePanel>
        <ResizableHandle />
        {/* Right Pane */}
        <ResizablePanel minSize={10} defaultSize={15}>
          <RoomDetails />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
