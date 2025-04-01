import clsx from "clsx";
import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";

import { polygon, featureCollection } from "@turf/helpers";
import { union } from "@turf/union";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function RectPreview({
  rectangles,
  hintWidth = 150,
  hintHeight = 150,
  fillColor = "#00d49055",
  inStrokeColor = "transparent",
  inStrokeWidth = 1,
  outStrokeColor = "#00d490",
  outStrokeWidth = 4,
  className
}: {
  rectangles: Rect[];
  hintWidth?: number;
  hintHeight?: number;
  fillColor?: string;
  inStrokeColor?: string;
  inStrokeWidth?: number;
  outStrokeColor?: string;
  outStrokeWidth?: number;
  className?: string;
}) {
  const [scaledRects, setScaledRects] = useState<Rect[]>([]);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  // const [outline, setOutline] = useState<number[]>([]);
  const [outline, setOutline] = useState<any>([]);

  useEffect(() => {
    if (rectangles.length === 0) return;

    // Compute bounding box of all rectangles
    const minX = Math.min(...rectangles.map(r => r.left));
    const maxX = Math.max(...rectangles.map(r => r.left + r.width));
    const minY = Math.min(...rectangles.map(r => r.top));
    const maxY = Math.max(...rectangles.map(r => r.top + r.height));

    const originalWidth = maxX - minX;
    const originalHeight = maxY - minY;

    const aspectRatio = originalWidth / originalHeight;

    let scale = 1;

    if (aspectRatio < 1) {
      // more taller than wide
      // fit height
      scale = hintHeight / originalHeight;
    } else {
      // more wider than tall
      // fit width
      scale = hintWidth / originalWidth;
    }

    setCanvasWidth(originalWidth * scale);
    setCanvasHeight(originalHeight * scale);

    const scaledRects = rectangles.map(r => ({
      left: (r.left - minX) * scale,
      top: (r.top - minY) * scale,
      width: r.width * scale,
      height: r.height * scale
    }));
    setScaledRects(scaledRects);

    const polys = scaledRects.map(r =>
      polygon([
        [
          [r.left, r.top],
          [r.left + r.width, r.top],
          [r.left + r.width, r.top + r.height],
          [r.left, r.top + r.height],
          [r.left, r.top]
        ]
      ])
    );

    if (polys.length > 1) {
      const outlinePoly = union(featureCollection(polys));

      if (outlinePoly) {
        let coords = outlinePoly.geometry.coordinates.flat(2) as number[];
        setOutline(coords);
      }
    } else {
      setOutline(polys[0].geometry.coordinates.flat(2) as number[]);
    }
  }, [rectangles, canvasHeight]);

  return (
    <div className={clsx("flex overflow-x-auto pb-2", className)}>
      <Stage
        className='mx-auto'
        globalCompositeOperation='destination-out'
        width={canvasWidth}
        height={canvasHeight}
      >
        <Layer>
          {scaledRects.map((r, i) => (
            <Rect
              key={i}
              x={r.left}
              y={r.top}
              width={r.width}
              height={r.height}
              // fill='lightblue'
              fill={fillColor}
              stroke={inStrokeColor}
              strokeWidth={inStrokeWidth}
            />
          ))}

          {outline.length > 0 && (
            <Line
              points={outline}
              stroke={outStrokeColor}
              strokeWidth={outStrokeWidth}
              closed
              perfectDrawEnabled={false}
              lineJoin='round' // or 'bevel' or 'miter'
              lineCap='round' // or 'butt' or 'square'
              strokeScaleEnabled={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

/*

https://www.npmjs.com/package/@turf/union

const scaledRects = [
  {
    "left": 0,
    "top": 0,
    "width": 90,
    "height": 140
  },
  {
    "left": 0,
    "top": 140,
    "width": 50,
    "height": 10
  }
]

const polys = scaledRects.map(r => polygon([
  [
    [r.left, r.top],
    [r.left + r.width, r.top],
    [r.left + r.width, r.top + r.height],
    [r.left, r.top + r.height],
    [r.left, r.top],
  ]
]));

const outlinePoly = union(featureCollection(polys))

*/
