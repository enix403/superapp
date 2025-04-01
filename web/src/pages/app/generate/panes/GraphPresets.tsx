import { ResponsiveNetworkCanvas } from "@nivo/network";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { serverIdToNodeType } from "@/lib/nodes";
import { appNodeStyle } from "@/lib/node-styles";
import { repeatNode } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { memo } from "react";

interface PresetData {
  nodeTypes: number[];
  edges: [number, number][];
}

function makeNetworkData({ nodeTypes, edges }: PresetData) {
  return {
    nodes: nodeTypes.map((n, index) => ({
      id: `${index}`,
      color: appNodeStyle[serverIdToNodeType[n].id].iconColor
    })),
    links: edges.map(([a, b]) => ({
      source: `${a}`,
      target: `${b}`
    }))
  };
}

const PresetPreview = memo(({ preset }: { preset: PresetData }) => (
  <button className='h-[12rem] w-[12rem] shrink-0 rounded-2xl bg-indigo-50 tc hover:bg-indigo-100'>
    <ResponsiveNetworkCanvas
      data={makeNetworkData(preset)}
      isInteractive={false}
      centeringStrength={0.8}
      repulsivity={20}
      animate={false}
      // @ts-ignore
      nodeColor={n => n.color}
      nodeBorderWidth={1}
      linkThickness={2}
    />
  </button>
));

export function GraphPresets() {
  return (
    <>
      <div className='flex items-center justify-between px-4 pt-2'>
        <h2 className='text-xl font-bold tracking-tight'>Presets</h2>
        <div className='flex items-center gap-x-2'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full border-blue-700 text-blue-700'
          >
            <ChevronLeft strokeWidth={3} />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full border-blue-700 text-blue-700'
          >
            <ChevronRight strokeWidth={3} />
          </Button>
        </div>
      </div>
      <div className='flex max-w-full gap-x-4 overflow-auto p-4 pt-2.5'>
        {presets.map((preset, index) => (
          <PresetPreview key={index} preset={preset} />
        ))}
      </div>
    </>
  );
}

const presets: PresetData[] = [
  {
    nodeTypes: [0, 1, 2, 3, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 4],
      [2, 3]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 3, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 5],
      [2, 3],
      [2, 4]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 3, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 4],
      [0, 5],
      [2, 3]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 3, 4, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 4],
      [0, 6],
      [2, 3],
      [2, 5]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 3, 3, 4, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 5],
      [0, 4],
      [0, 7],
      [2, 3],
      [2, 6]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 2, 3, 4, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 5],
      [0, 3],
      [0, 7],
      [2, 4],
      [2, 6]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 2, 3, 3, 4, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 6],
      [0, 3],
      [0, 8],
      [2, 4],
      [2, 7],
      [3, 5]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 2, 3, 3, 3, 4, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 7],
      [0, 3],
      [0, 6],
      [0, 9],
      [2, 4],
      [2, 8],
      [3, 5]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 2, 3, 3, 3, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 3],
      [0, 6],
      [0, 8],
      [2, 4],
      [2, 7],
      [3, 5]
    ]
  },
  {
    nodeTypes: [0, 1, 2, 2, 2, 3, 3, 3, 4, 14],
    edges: [
      [0, 2],
      [0, 1],
      [0, 3],
      [0, 4],
      [0, 9],
      [2, 5],
      [2, 8],
      [3, 6],
      [4, 7]
    ]
  }
];

presets.reverse();
