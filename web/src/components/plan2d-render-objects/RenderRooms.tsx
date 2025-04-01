import { appNodeStyle } from "@/lib/node-styles";
import { useRenderObjectComponents } from "./RenderObjectsProvider";
import { Rect } from "react-konva";
import { CELL_SIZE } from "@/lib/units";

export function RenderRooms() {
  const plan = useRenderObjectComponents();
  return plan.rooms.map((room, i) => {
    const style = appNodeStyle[room.typeId];
    const color = style.mapRectColor;
    return room.rects.map(({ row, col, width, height }, j) => (
      <Rect
        key={`room-${i}-${j}`}
        x={col * CELL_SIZE}
        y={row * CELL_SIZE}
        width={width * CELL_SIZE}
        height={height * CELL_SIZE}
        fill={color}
        stroke={color}
      />
    ));
  });
}
