import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  type Node,
  type NodeProps
} from "@xyflow/react";
import { Link2, Plus } from "lucide-react";
import clsx from "clsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { appRoomTypes, idToNodeType } from "@/lib/nodes";
import { appNodeStyle } from "@/lib/node-styles";
import { NodeSlab } from "@/components/NodeSlab";
import { useCallback, useEffect } from "react";
import { canAddEdge, createNewNode } from "./add-node";
import { LayoutEdge } from "./LayoutEdge";
import { useLayoutEditorSettings } from "./LayoutEditorSettings";

function AddNodeButton({ nodeId }: { nodeId: string }) {
  const { getNodes, getNode, getEdges, addNodes, addEdges } = useReactFlow<
    LayoutNode,
    LayoutEdge
  >();

  const handleAddNode = useCallback(
    (newNodeTypeId: string) => {
      const thisNode = getNode(nodeId)!;

      const [newNode, newEdge] = createNewNode(
        newNodeTypeId,
        nodeId,
        getNodes()
      );

      if (canAddEdge(thisNode, newNode, getEdges())) {
        addNodes(newNode);
        addEdges(newEdge);
      }
    },
    [nodeId, getNodes, getNode, addNodes, getEdges]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={clsx(
            "nodrag nopan cursor-crosshair",
            "!h-auto !w-auto rounded-full !border-none !bg-[#79dcbd] !p-1",
            "absolute !top-[calc(50%-12px)] right-0 translate-x-1/2 -translate-y-1/2"
          )}
        >
          <Plus size={14} className='text-white' strokeWidth={3} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Connect a New Room</DropdownMenuLabel>
        <DropdownMenuGroup>
          {appRoomTypes.map(roomType => {
            const style = appNodeStyle[roomType.id];
            return (
              <DropdownMenuItem
                key={roomType.id}
                onSelect={() => handleAddNode(roomType.id)}
              >
                <style.Icon size={16} color={style.iconColor} />
                <span className='truncate'>{roomType.title}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type LayoutNode = Node<
  {
    label: string;
    typeId: string;
  },
  "custom"
>;

export function LayoutNode({ id, data, selected }: NodeProps<LayoutNode>) {
  const { label, typeId } = data;

  const updateNodeInternals = useUpdateNodeInternals();
  const { readOnly } = useLayoutEditorSettings();

  useEffect(() => {
    updateNodeInternals(id);
  }, [updateNodeInternals, id, readOnly]);

  return (
    <>
      <NodeSlab
        title={label}
        subtitle={idToNodeType[typeId].title}
        typeId={typeId}
        showBorder={!readOnly && selected}
        className={clsx(
          "relative min-w-56",
          "shadow-[0px_10px_36px_-6px_rgba(0,_0,_0,_0.1)]"
        )}
      />

      {!readOnly && <AddNodeButton nodeId={id} />}

      <Handle
        type='source'
        position={Position.Right}
        isConnectableEnd={false}
        className={clsx(
          "!h-auto !w-auto !border-none !bg-[#AF79DC] !p-1",
          "!top-[calc(50%+12px)]",
          readOnly && "opacity-0"
        )}
      >
        <Link2
          size={14}
          className='pointer-events-none text-white'
          strokeWidth={3}
        />
      </Handle>

      <Handle
        type='target'
        position={Position.Left}
        isConnectableStart={false}
        className='!top-0 !left-0 !h-full !w-full !transform-none !rounded-none opacity-0'
      />
    </>
  );
}
