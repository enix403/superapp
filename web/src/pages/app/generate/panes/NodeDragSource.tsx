import clsx from "clsx";
import { appNodeTypes, NodeType } from "@/lib/nodes";
import { NodeSlab } from "@/components/NodeSlab";
import { Info } from "lucide-react";

/* ========================== */

function Source({ nodeType }: { nodeType: NodeType }) {
  return (
    <NodeSlab
      title={nodeType.title}
      className={clsx("shadow-sm", "cursor-grab select-none")}
      typeId={nodeType.id}
      showBorder
      draggable
      onDragStart={event => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("custom/source-node-type", nodeType.id);
      }}
    />
  );
}

export function NodeDragSource() {
  return (
    <div className='flex h-full max-h-full w-[16rem] flex-col overflow-y-auto p-4'>
      <h2 className='mb-2 font-semibold'>Available Rooms</h2>

      <div
        className='mb-4 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800'
        role='alert'
      >
        Drag rooms from here and drop into the editor!
      </div>

      <div className='-mx-4 -mb-4 flex-1-y space-y-2 px-4 pb-4'>
        {appNodeTypes.map(nodeType => {
          return <Source key={nodeType.id} nodeType={nodeType} />;
        })}
      </div>
    </div>
  );
}
