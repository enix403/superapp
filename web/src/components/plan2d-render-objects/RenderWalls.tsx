import { Rect } from "react-konva";

import { calcLineRect } from "./common";
import { useRenderObjectComponents } from "./RenderObjectsProvider";

export function RenderWalls({ fill = "#000000" }: { fill?: string }) {
  const components = useRenderObjectComponents();

  return components.walls.map(
    ({ id, row, col, length, direction, width: thickness }) => {
      const { x, y, width, height } = calcLineRect(
        row,
        col,
        length,
        direction,
        thickness
      );

      return (
        <Rect
          key={id}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          stroke='black'
          strokeWidth={1.5}
        />
      );
    }
  );
}
