import { Text, Line } from "react-konva";

import { CELL_PHYSICAL_LENGTH, unitFactor } from "@/lib/units";
import { useRenderObjectComponents } from "./RenderObjectsProvider";
import { calcLineRect } from "./common";

function WallMeasure({
  unit,
  side,
  x,
  y,
  width,
  height,
  length,
  gap = 8,
  textGap = 8
}) {
  let points: any[] = [];

  {
    const w = width - 1;
    const h = height - 1;

    if (side === "top") {
      points = [x, y, x, y - gap, x + w, y - gap, x + w, y];
    } else if (side === "bottom") {
      points = [x, y + h, x, y + h + gap, x + w, y + h + gap, x + w, y + h];
    } else if (side === "left") {
      points = [x, y, x - gap, y, x - gap, y + h, x, y + h];
    } else if (side === "right") {
      points = [x + w, y, x + w + gap, y, x + w + gap, y + h, x + w, y + h];
    }
  }

  let lineCenterX = Math.round((points[2] + points[4]) / 2);
  let lineCenterY = Math.round((points[3] + points[5]) / 2);

  if (side == "top") lineCenterY -= textGap;
  if (side == "bottom") lineCenterY += textGap;
  if (side == "left") lineCenterX -= textGap;
  if (side == "right") lineCenterX += textGap;

  let rot = 0;
  if (side === "right") {
    rot = 90;
  } else if (side === "left") {
    rot = -90;
  }

  const physicalLength = Math.round(
    length * CELL_PHYSICAL_LENGTH * (unitFactor[unit] || 1)
  );

  return (
    <>
      <Line points={points} stroke='#AAAAAA' />
      <Text
        text={`${physicalLength} ${unit}`}
        fontSize={16}
        fill='#848484'
        x={lineCenterX}
        y={lineCenterY}
        width={1000}
        height={1000}
        offsetX={500}
        offsetY={500}
        align='center'
        verticalAlign='middle'
        rotation={rot}
      />
    </>
  );
}

export function RenderWallMeasures({ unit }: { unit: string }) {
  const components = useRenderObjectComponents();

  return components.walls.map(
    ({ id, row, col, length, direction, width: thickness }) => {
      if (length < 25) return null;

      const { x, y, width, height } = calcLineRect(
        row,
        col,
        length,
        direction,
        thickness
      );

      return (
        <WallMeasure
          unit={unit}
          key={id}
          x={x}
          y={y}
          width={width}
          height={height}
          length={length}
          side={direction === "h" ? "top" : "right"}
        />
      );
    }
  );
}
