import { GeneralSettings } from "./panes/GeneralSettings";
import { useCallback, useState } from "react";

import { NodeDragSource } from "./panes/NodeDragSource";
import { GraphPresets } from "./panes/GraphPresets";
import { LayoutGraphTitle } from "./panes/LayoutGraphTitle";
import { Toolbar } from "./panes/Toolbar";

import { LayoutNode } from "@/components/layout-editor/LayoutNode";
import { LayoutEdge } from "@/components/layout-editor/LayoutEdge";
import { LayoutGraphEditor } from "@/components/layout-editor/LayoutGraphEditor";
import { StateSet } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MousePointerClick } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AppTopNav } from "@/components/topnav/AppTopNav";
import { packLayout } from "./impl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api-routes";
import { toast } from "sonner";

function LayoutGraphPanes({
  nodes,
  setNodes,
  edges,
  setEdges
}: {
  nodes: LayoutNode[];
  setNodes: StateSet<LayoutNode[]>;
  edges: LayoutEdge[];
  setEdges: StateSet<LayoutEdge[]>;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState("");

  const selectedNode = nodes.find(n => n.id === selectedNodeId) ?? null;

  const updateNodeData = useCallback(
    (updates: Partial<LayoutNode["data"]>) => {
      setNodes(prev =>
        prev.map(node =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...updates
                }
              }
            : node
        )
      );
    },
    [selectedNodeId, setNodes]
  );

  return (
    <>
      <LayoutGraphTitle />
      <Toolbar node={selectedNode} updateNodeData={updateNodeData} />
      <div className='flex flex-1-fix'>
        <div className='flex-1-fix shrink-0'>
          <LayoutGraphEditor
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onSelection={(node: LayoutNode | null) => {
              setSelectedNodeId(node?.id || "");
            }}
            // readOnly
          />
        </div>
        <div className='max-h-full max-w-sm border-l-2'>
          <NodeDragSource />
        </div>
      </div>
      {/* TODO: make it collapsible */}
      {/* <div className='shrink-0 border-t-2'>
        <GraphPresets />
      </div> */}
    </>
  );
}

export function GenerateDesign() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<LayoutNode[]>(initialNodes);
  const [edges, setEdges] = useState<LayoutEdge[]>(initialEdges);

  const generateMut = useMutation({
    mutationFn: () => {
      const layout = packLayout(nodes, edges);
      const generationSettings = {
        name: "My Plan 16",
        plotWidth: 100,
        plotLength: 116,
        plotMeasureUnit: "ft",
        layout
      };
      console.log(generationSettings);
      return apiRoutes.generatePlan(generationSettings);
    },
    onSuccess: ({ plan }) => {
      /* @ts-ignore */
      navigate(`/app/edit-plan/${plan.id}`);
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
    onError: () => {
      toast.error("Failed to generate plan");
    }
  });

  return (
    <div className='flex h-full max-h-full flex-col overflow-hidden'>
      <AppTopNav />
      <div className='flex flex-1-fix'>
        <div className='flex w-[22rem] flex-col gap-y-3 border-r-2 p-4'>
          <Button
            size='lg'
            variant='outline'
            disabled={generateMut.isPending}
            asChild
          >
            <Link to='/app'>
              <ArrowLeft />
              Back
            </Link>
          </Button>

          <div className='flex-1-y'>
            <GeneralSettings />
          </div>
          <Button
            size='lg'
            className='mt-auto atext-ls'
            loading={generateMut.isPending}
            onClick={() => generateMut.mutate()}
          >
            Generate
            <MousePointerClick />
          </Button>
        </div>
        <div className='flex flex-1-fix flex-col'>
          <LayoutGraphPanes
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
          />
        </div>
      </div>
    </div>
  );
}

/* =================================== */

const initialNodes: LayoutNode[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 0, y: 0 },
    data: { label: "Front Door Entrance", typeId: "fdoor" }
  },
  {
    id: "2",
    type: "custom",
    position: { x: 220, y: -180 },
    data: { label: "Main Living Room", typeId: "living" }
  }
];

const initialEdges: LayoutEdge[] = [
  {
    id: "e1",
    source: "1",
    target: "2"
  }
];
