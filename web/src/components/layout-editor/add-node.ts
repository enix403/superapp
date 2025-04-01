import { FRONT_DOOR_ID, idToNodeType } from "@/lib/nodes";
import { LayoutNode } from "./LayoutNode";
import { LayoutEdge } from "./LayoutEdge";

// Default size for nodes if not explicitly set
const DEFAULT_NODE_SIZE = { width: 300, height: 60 };

// Helper function to check for overlap between candidate node and existing nodes
function isCollision(candidate, newNodeSize, nodes) {
  const candidateBox = {
    left: candidate.x,
    right: candidate.x + newNodeSize.width,
    top: candidate.y,
    bottom: candidate.y + newNodeSize.height
  };

  for (const node of nodes) {
    const nodeSize = {
      width: node.width || DEFAULT_NODE_SIZE.width,
      height: node.height || DEFAULT_NODE_SIZE.height
    };
    const nodeBox = {
      left: node.position.x,
      right: node.position.x + nodeSize.width,
      top: node.position.y,
      bottom: node.position.y + nodeSize.height
    };

    // Check if the candidate overlaps with this node
    if (
      !(
        candidateBox.right < nodeBox.left ||
        candidateBox.left > nodeBox.right ||
        candidateBox.bottom < nodeBox.top ||
        candidateBox.top > nodeBox.bottom
      )
    ) {
      return true;
    }
  }
  return false;
}

// Function to find the next free position near the reference node using a spiral search
function getNextNodePosition(
  nodes,
  referenceNodeId,
  newNodeSize = DEFAULT_NODE_SIZE
) {
  const referenceNode = nodes.find(n => n.id === referenceNodeId);
  if (!referenceNode) return { x: 100, y: 100 }; // Fallback if reference node not found

  // Compute the center of the reference node
  const refWidth = referenceNode.width || DEFAULT_NODE_SIZE.width;
  const refHeight = referenceNode.height || DEFAULT_NODE_SIZE.height;
  const refCenter = {
    x: referenceNode.position.x + refWidth / 2,
    y: referenceNode.position.y + refHeight / 2
  };

  // Parameters for the spiral search
  const startRadius = 250;
  const radiusStep = 100;
  const maxRadius = 1000;
  const startAngle = 45 + 180; // degrees
  const angleStep = 15; // degrees
  const toRadians = angle => angle * (Math.PI / 180);

  // Spiral outwards from the reference center to search for an available spot.
  for (let radius = startRadius; radius <= maxRadius; radius += radiusStep) {
    for (let angle = startAngle; angle < 360; angle += angleStep) {
      // Compute offset from the center using polar coordinates
      const offsetX = radius * Math.cos(toRadians(angle));
      const offsetY = radius * Math.sin(toRadians(angle));

      // Candidate top-left position such that the new node is centered at the candidate point
      const candidate = {
        x: refCenter.x + offsetX - newNodeSize.width / 2,
        y: refCenter.y + offsetY - newNodeSize.height / 2
      };

      // If the candidate does not collide with any existing node, return it
      if (!isCollision(candidate, newNodeSize, nodes)) {
        return candidate;
      }
    }
  }

  // Fallback: if no free space was found, place the new node to the right of the reference node.
  return {
    x: referenceNode.position.x + refWidth + 20,
    y: referenceNode.position.y
  };
}

let nextNodeId = 0;
let nextEdgeId = 0;

export const getNewNodeId = () => `A${nextNodeId++}`;
export const getNewEdgeId = () => `E${nextEdgeId++}`;

export function createNewNode(
  typeId: string,
  referenceNodeId: string,
  nodes: LayoutNode[]
) {
  const nodeType = idToNodeType[typeId];
  const position = getNextNodePosition(nodes, referenceNodeId);

  const newNode = {
    id: getNewNodeId(),
    type: "custom",
    position,
    data: {
      label: getNewNodeName(nodes, typeId),
      typeId: nodeType.id
    }
  } as LayoutNode;

  const newEdge = {
    id: getNewEdgeId(),
    type: "custom",
    source: referenceNodeId,
    target: newNode.id
  } as LayoutEdge;

  return [newNode, newEdge] as const;
}

export function canAddEdge(
  sourceNode: LayoutNode,
  targetNode: LayoutNode,
  edges: LayoutEdge[]
) {
  const isSourceFrontDoor = sourceNode.data.typeId === FRONT_DOOR_ID;
  const isTargetFrontDoor = targetNode.data.typeId === FRONT_DOOR_ID;

  // Disallow connections between two FRONT_DOOR_ID nodes
  if (isSourceFrontDoor && isTargetFrontDoor) return false;

  // Check if either node is FRONT_DOOR_ID and already has a connection
  const hasExistingConnection = edges.some(
    edge =>
      (isSourceFrontDoor &&
        (edge.source === sourceNode.id || edge.target === sourceNode.id)) ||
      (isTargetFrontDoor &&
        (edge.source === targetNode.id || edge.target === targetNode.id))
  );

  if (hasExistingConnection) return false;

  return true;
}

export function getNewNodeName(nodes: LayoutNode[], typeId: string) {
  const existingCount = nodes.filter(n => n.data.typeId === typeId).length;
  const nodeType = idToNodeType[typeId];

  if (!nodeType) return "Room";

  return `${nodeType.title} ${existingCount + 1}`;
}
