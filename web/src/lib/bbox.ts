import Konva from "konva";
import { useLayoutEffect, useState } from "react";

import { CELL_SIZE } from "@/lib/units";
import { Nullable, Size } from "@/lib/utils";

export type PlanFocus = {
  planCenter: Konva.Vector2d;
  baseScale: number;
};

const noFocus: PlanFocus = {
  planCenter: { x: NaN, y: NaN },
  baseScale: 1
};

function calculateFocus(components: any, containerSize: Size) {
  if (components.rooms.length === 0) return noFocus;

  let minRow = Infinity,
    minCol = Infinity;
  let maxRow = -Infinity,
    maxCol = -Infinity;

  // Find bounding box of all room rects
  components.rooms.forEach(room => {
    room.rects.forEach(({ row, col, width, height }) => {
      minRow = Math.min(minRow, row);
      minCol = Math.min(minCol, col);
      maxRow = Math.max(maxRow, row + height);
      maxCol = Math.max(maxCol, col + width);
    });
  });

  // Convert to pixel dimensions
  const boundingWidth = (maxCol - minCol) * CELL_SIZE;
  const boundingHeight = (maxRow - minRow) * CELL_SIZE;

  const paddingFactor = 0.9; // Leave 10% padding around the plan
  const scaleX = (containerSize.width / boundingWidth) * paddingFactor;
  const scaleY = (containerSize.height / boundingHeight) * paddingFactor;
  const baseScale = Math.min(scaleX, scaleY); // Fit to the smaller dimension

  // Compute center of bounding box
  const centerX = ((minCol + maxCol) / 2) * CELL_SIZE;
  const centerY = ((minRow + maxRow) / 2) * CELL_SIZE;

  // Compute new viewport offset to center it
  const screenCenterX = containerSize.width / 2;
  const screenCenterY = containerSize.height / 2;

  const planCenter = {
    x: screenCenterX - centerX * baseScale,
    y: screenCenterY - centerY * baseScale
  };

  return { planCenter, baseScale } as PlanFocus;
}

export function usePlanFocus(components: any, containerSize: Nullable<Size>) {
  const [focus, setFocus] = useState(noFocus);

  useLayoutEffect(() => {
    if (!containerSize.width || !containerSize.height) return;

    setFocus(calculateFocus(components, containerSize as any));
  }, [containerSize]);

  return focus;
}
