import { Text } from "react-konva";
import { useRenderObjectComponents } from "./RenderObjectsProvider";
import { CELL_SIZE } from "@/lib/units";

export function RenderRoomLabels() {
  const components = useRenderObjectComponents();

  return components.rooms.map((room, i) => {
    let largestRectIndex = -1;
    let largestArea = -1;

    for (let i = 0; i < room.rects.length; ++i) {
      const { width, height } = room.rects[i];
      let area = width * height;

      if (area > largestArea) {
        largestArea = area;
        largestRectIndex = i;
      }
    }

    let { row, col, width, height } = room.rects[largestRectIndex];

    const label = room.label;

    if (!label) return;

    return (
      <Text
        key={room.id}
        x={(col + width / 2) * CELL_SIZE}
        y={(row + height / 2) * CELL_SIZE}
        width={1000}
        height={1000}
        offsetX={500}
        offsetY={500}
        align='center'
        verticalAlign='middle'
        text={label}
        fontSize={13}
        fill={"black"}
      />
    );
  });
}