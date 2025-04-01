import Konva from "konva";
import { RefObject, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { PlanFocus, usePlanFocus } from "./bbox";
import { Nullable, ParamVoidCallback, Size } from "./utils";

function _scaleStageToImpl(
  stage: Konva.Stage,
  newScale: number,
  focusPoint?: Konva.Vector2d
) {
  if (!focusPoint)
    focusPoint = {
      x: stage.width() / 2,
      y: stage.height() / 2
    };

  /* ===== Set Position ===== */
  const oldScale = stage.scaleX();

  const mousePointTo = {
    x: (focusPoint.x - stage.x()) / oldScale,
    y: (focusPoint.y - stage.y()) / oldScale
  };

  const newPos = {
    x: focusPoint.x - mousePointTo.x * newScale,
    y: focusPoint.y - mousePointTo.y * newScale
  };

  stage.position(newPos);

  /* ===== Set Scale ===== */
  stage.scale({ x: newScale, y: newScale });
}

export class Camera {
  public constructor(
    private readonly stageRef: RefObject<Konva.Stage | null>,
    private readonly focus: PlanFocus,
    private readonly onZoomLevelUpdate: ParamVoidCallback<number>
  ) {
  }

  public get Stage() {
    return this.stageRef.current;
  }

  public isStageActive() {
    return Boolean(this.Stage) && !isNaN(this.focus.planCenter.x);
  }

  public get CurrentScale() {
    return this.stageRef.current?.scaleX() || 1;
  }

  public get BaseScale() {
    return this.focus.baseScale;
  }

  public get PlanCenter() {
    return this.focus.planCenter;
  }

  public scaleStageTo(newScale: number, focusPoint?: Konva.Vector2d) {
    if (!this.Stage) return;

    _scaleStageToImpl(this.Stage, newScale, focusPoint);
    this.onZoomLevelUpdate(newScale / this.focus.baseScale);
  }

  public moveStageTo(pos: Konva.Vector2d) {
    if (!this.Stage) return;

    this.Stage.position(pos);
  }

  public setZoom(zoomLevel: number) {
    this.scaleStageTo(zoomLevel * this.focus.baseScale);
  }

  public recenter() {
    this.scaleStageTo(this.BaseScale);
    this.moveStageTo(this.PlanCenter);
  }
}

export function useCamera(
  stageRef: RefObject<Konva.Stage | null>,
  containerSize: Nullable<Size>,
  components: any,
  onZoomLevelUpdate?: ParamVoidCallback<number>
) {
  const focus = usePlanFocus(components, containerSize);
  const camera = useMemo(
    () => new Camera(stageRef, focus, onZoomLevelUpdate ?? (() => {})),
    [focus, onZoomLevelUpdate]
  );

  useEffect(() => {
    camera.scaleStageTo(camera.CurrentScale);
  }, [camera]);

  return camera;
}

export function useInitialRecenter(camera: Camera) {
  const initiallyRecentered = useRef(false);

  useLayoutEffect(() => {
    if (!camera.isStageActive()) {
      return;
    }

    if (initiallyRecentered.current) {
      return;
    }

    initiallyRecentered.current = true;

    camera.recenter();
  }, [camera]);
}
