import { Rect } from "react-konva";
import { calcLineRect } from "./common";
import { useRenderObjectComponents } from "./RenderObjectsProvider";

export function RenderDoors() {
  const components = useRenderObjectComponents();

  return components.doors.map(({ id, row, col, length, direction }) => {
    const { x, y, width, height } = calcLineRect(
      row,
      col,
      length,
      direction,
      1
    );

    return (
      <Rect key={id} x={x} y={y} width={width} height={height} fill='#F6F6F6' />
    );
  });
}
