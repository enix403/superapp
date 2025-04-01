import { serverIdToNodeType } from "@/lib/nodes";

export type RoomRect = [
  number /* row */,
  number /* col */,
  number /* width */,
  number /* height */
];

// TODO: fill
type PlanCanvasData = any;

export function buildComponents(canvasData: PlanCanvasData) {
  const { shape, rooms, walls, doors, scale } = canvasData;

  const [canvasRows, canvasCols] = shape;
  const [scaleRows, scaleCols] = scale;

  let wallsN = walls.map((wall, index) => ({
    id: `wall-${index}`,
    row: wall[0] as number,
    col: wall[1] as number,
    length: wall[2] as number,
    direction: wall[3] as "h" | "v",
    width: 1
  }));

  let doorsN = doors.map((door, index) => ({
    id: `door-${index}`,
    row: door[0] as number,
    col: door[1] as number,
    length: door[2] as number,
    direction: door[3] as "h" | "v"
  }));

  let roomsN = rooms
    .filter(vals => vals.length > 1)
    .map((room, index) => {
      let [type, ...flatRects] = room;
      let rects: RoomRect[] = [];

      for (let i = 0; i < flatRects.length; i += 4) {
        rects.push([
          scaleRows * flatRects[i],
          scaleCols * flatRects[i + 1],
          scaleCols * flatRects[i + 2],
          scaleRows * flatRects[i + 3]
        ]);
      }

      const nodeType = serverIdToNodeType[type];

      return {
        typeId: nodeType.id,
        id: `room-${index}`,
        label: nodeType.title ?? "Room",
        rects
      };
    });

  return {
    canvasRows,
    canvasCols,
    walls: wallsN,
    doors: doorsN,
    rooms: roomsN
  };
}

export function buildInitPlan(serverPlan) {
  const planInfo: PlanInfo = {
    id: serverPlan.id,
    name: serverPlan.name,
    plotWidth: serverPlan.plotWidth,
    plotLength: serverPlan.plotLength,
    plotMeasureUnit: serverPlan.plotMeasureUnit,
    canvasId: serverPlan.canvas.id,
    layout: serverPlan.layout
  };

  const planComponents = buildComponents(serverPlan.canvas.canvasData);

  return {
    planInfo,
    planComponents
  };
}

export type PlanComponents = ReturnType<typeof buildComponents>;

export interface PlanLayoutData {
  nodes: {
    label: string;
    typeId: number;
    position: { x: number; y: number };
  }[];
  edges: [number, number][];
}

export interface PlanInfo {
  id: string;
  name: string;
  plotWidth: number;
  plotLength: number;
  plotMeasureUnit: string;
  canvasId: string;
  layout: PlanLayoutData;
}
