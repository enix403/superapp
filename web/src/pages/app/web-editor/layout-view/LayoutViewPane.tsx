import { useMemo } from "react";
import { LayoutGraphEditor } from "@/components/layout-editor/LayoutGraphEditor";
import { LayoutNode } from "@/components/layout-editor/LayoutNode";
import { LayoutEdge } from "@/components/layout-editor/LayoutEdge";

import { useInitState } from "@/hooks/useInitState";
import { usePlan } from "../plan-state";

function buildFlowState(serverLayout) {
  const nodes = serverLayout.nodes.map(
    (serverNode, index) =>
      ({
        id: `n-${index}`,
        type: "custom",
        position: serverNode.position,
        data: {
          label: serverNode.label,
          typeId: serverNode.typeId
        }
      }) as LayoutNode
  );

  const edges = serverLayout.edges.map(
    (serverEdge, index) =>
      ({
        id: `e-${index}`,
        source: nodes[serverEdge[0]].id,
        target: nodes[serverEdge[1]].id,
      }) as LayoutEdge
  );

  return { nodes, edges };
}

export function LayoutViewPane() {
  const serverLayout = usePlan().layout;

  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildFlowState(serverLayout),
    [serverLayout]
  );

  const [nodes, setNodes] = useInitState<LayoutNode[]>(initNodes);
  const [edges, setEdges] = useInitState<LayoutEdge[]>(initEdges);

  return (
    <LayoutGraphEditor
      nodes={nodes}
      setNodes={setNodes}
      edges={edges}
      setEdges={setEdges}
      readOnly
    />
  );
}