import { LayoutEdge } from "@/components/layout-editor/LayoutEdge";
import { LayoutNode } from "@/components/layout-editor/LayoutNode";

export function packLayout(nodes: LayoutNode[], edges: LayoutEdge[]) {
  let nodeIdToIndex = {};
  let index = 0;
  for (const node of nodes) {
    nodeIdToIndex[node.id] = index++;
  }

  let serverNodes = nodes.map(node => ({
    label: node.data.label,
    // typeId: idToNodeType[node.data.typeId].serverId,
    typeId: node.data.typeId,
    position: node.position
  }));

  let serverEdges = edges.map(edge => [
    nodeIdToIndex[edge.source],
    nodeIdToIndex[edge.target]
  ]);

  const layout = {
    nodes: serverNodes,
    edges: serverEdges
  };

  return layout;
}
