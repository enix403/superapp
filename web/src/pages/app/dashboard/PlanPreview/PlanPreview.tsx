import Konva from "konva";

import { useRef } from "react";
import { Stage, Layer } from "react-konva";
import { useMeasure } from "@uidotdev/usehooks";
import { useCamera, useInitialRecenter } from "@/lib/camera";

import { RenderObjectsProvider } from "@/components/plan2d-render-objects/RenderObjectsProvider";
import { RenderRooms } from "@/components/plan2d-render-objects/RenderRooms";
import { RenderWalls } from "@/components/plan2d-render-objects/RenderWalls";
import { RenderDoors } from "@/components/plan2d-render-objects/RenderDoors";

export function PlanPreview({ plan }: { plan: any }) {
  const [containerRef, containerSize] = useMeasure();
  const stageRef = useRef<Konva.Stage | null>(null);

  const components = plan.canvas.canvasData;
  const camera = useCamera(stageRef, containerSize, components);
  useInitialRecenter(camera);
  return (
    <div ref={containerRef} className='h-full max-h-full w-full max-w-full'>
      <Stage
        ref={stageRef}
        width={containerSize.width || 0}
        height={containerSize.height || 0}
        style={{ background: "#F6F6F6" }}
      >
        <RenderObjectsProvider planComponents={components}>
          <Layer>
            <RenderRooms />
            <RenderWalls />
            <RenderDoors />
          </Layer>
        </RenderObjectsProvider>
      </Stage>
    </div>
  );
}
