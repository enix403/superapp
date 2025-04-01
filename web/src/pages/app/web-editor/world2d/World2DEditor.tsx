import Konva from "konva";
import { useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { useMeasure } from "@uidotdev/usehooks";

import { useSettings, useSetZoomLevel } from "./state/settings";
import { useWheelZoomListener } from "./hooks/useWheelZoomListener";
import { commandsSubject } from "./state/commands";
import { useCamera, useInitialRecenter } from "@/lib/camera";
import { usePlanComponents } from "../plan-state";

import { RenderObjectsProvider } from "@/components/plan2d-render-objects/RenderObjectsProvider";
import { RenderRooms } from "@/components/plan2d-render-objects/RenderRooms";
import { RenderWalls } from "@/components/plan2d-render-objects/RenderWalls";
import { RenderDoors } from "@/components/plan2d-render-objects/RenderDoors";
import { RenderRoomLabels } from "@/components/plan2d-render-objects/RenderRoomLabels";
import { RenderWallMeasures } from "@/components/plan2d-render-objects/RenderWallMeasures";

/* ============================================= */

export function World2DEditor() {
  const components = usePlanComponents();

  const [containerRef, containerSize] = useMeasure();
  const stageRef = useRef<Konva.Stage | null>(null);

  const setZoomLevel = useSetZoomLevel();
  const camera = useCamera(stageRef, containerSize, components, setZoomLevel);

  useInitialRecenter(camera);
  useWheelZoomListener(camera);

  useEffect(() => {
    const subscription = commandsSubject.subscribe(cmd => {
      if (cmd.type === "recenter") {
        camera.recenter();
      } else if (cmd.type === "set-zoom") {
        camera.setZoom(cmd.zoomPercent / 100.0);
      }
    });

    return () => subscription.unsubscribe();
  }, [camera]);

  const settings = useSettings();

  const wallColor = settings.viewMode === "color" ? "#000000" : "#919191";

  return (
    <div ref={containerRef} className='h-full max-h-full w-full max-w-full'>
      <Stage
        ref={stageRef}
        width={containerSize.width || 0}
        height={containerSize.height || 0}
        draggable
        style={{ background: "#F6F6F6" }}
      >
        <RenderObjectsProvider planComponents={components}>
          <Layer>
            {settings.viewMode === "color" && <RenderRooms />}
            <RenderWalls fill={wallColor} />
            <RenderDoors />
            {settings.enableRoomLabels && <RenderRoomLabels />}
            {settings.enableWallMeasure && (
              <RenderWallMeasures unit={settings.unit} />
            )}
          </Layer>
        </RenderObjectsProvider>
      </Stage>
    </div>
  );
}
