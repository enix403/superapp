import { Button } from "@/components/ui/button";
import { RoomIdentityInput } from "@/components/RoomIdentityInput";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Info, Redo, Undo } from "lucide-react";
import { LayoutNode } from "@/components/layout-editor/LayoutNode";
import { memo } from "react";

// TODO: Simplify. Too many unnecessary flex divs
export const Toolbar = memo(
  ({
    node,
    updateNodeData
  }: {
    node: LayoutNode | null;
    updateNodeData: (data: Partial<LayoutNode["data"]>) => void;
  }) => {
    return (
      <nav className='flex gap-x-2 border-b px-4 py-2'>
        <div className='flex flex-1 items-center'>
          {node ? (
            <RoomIdentityInput
              key={node.id}
              className='max-w-lg flex-1'
              initialName={node.data.label}
              initialTypeId={node.data.typeId}
              onUpdateName={name => updateNodeData({ label: name })}
              onUpdateNodeType={typeId => updateNodeData({ typeId })}
            />
          ) : (
            <p className='flex flex-1-x items-center gap-x-2 text-muted-foreground/70'>
              <Info className='shrink-0' />
              <span className='font-medium tracking-tight'>
                Select a node in the editor to inspect
              </span>
            </p>
          )}
        </div>
        <div className='flex items-center justify-end'>
          <TooltipWrapper tip='Undo'>
            <Button size='icon' variant='ghost'>
              <Undo size={20} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tip='Redo'>
            <Button size='icon' variant='ghost'>
              <Redo size={20} />
            </Button>
          </TooltipWrapper>
        </div>
      </nav>
    );
  }
);
