import Konva from "konva";
import { useEffect } from "react";
import { Camera } from "@/lib/camera";

const MIN_SCALE_REL = 0.5;
const MAX_SCALE_REL = 4;

export function useWheelZoomListener(camera: Camera) {
  useEffect(() => {
    if (!camera.isStageActive()) {
      return;
    }
    const stage = camera.Stage!;

    const minScale = MIN_SCALE_REL * camera.BaseScale;
    const maxScale = MAX_SCALE_REL * camera.BaseScale;

    function onWheelImpl(stage: Konva.Stage, zoomAmount: number) {
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const newScale = Math.max(
        minScale,
        Math.min(maxScale, stage.scaleX() - zoomAmount * 0.001)
      );

      camera.scaleStageTo(newScale, pointer);
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      onWheelImpl(stage!, event.deltaY);
    }

    stage.content.addEventListener("wheel", onWheel);

    return () => {
      stage.content.removeEventListener("wheel", onWheel);
    };
  }, [camera]);
}
