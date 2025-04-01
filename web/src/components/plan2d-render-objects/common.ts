import {
  CELL_SIZE,
  snapToGrid,
} from "@/lib/units";

export function calcLineRect(
  row: number,
  col: number,
  length: number,
  direction: "h" | "v",
  thickness = 1
) {
  const x = snapToGrid(col * CELL_SIZE);
  const y = snapToGrid(row * CELL_SIZE);

  let width = thickness;
  let height = thickness;

  if (direction == "h") {
    width = length;
  } else {
    height = length;
  }

  width *= CELL_SIZE;
  height *= CELL_SIZE;

  return { x, y, width, height };
}
