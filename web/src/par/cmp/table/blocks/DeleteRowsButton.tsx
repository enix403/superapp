import { type Table as TableInstance } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VoidCallback } from "@/lib/utils";
import { ConfirmDialog } from "@/par/cmp/ConfirmDialog";

export function DeleteRowsButton<Item>({
  table,
  onDelete
}: {
  table: TableInstance<Item>;
  onDelete?: VoidCallback;
}) {
  const numRows = table.getSelectedRowModel().rows.length;

  return (
    <ConfirmDialog
      subtitle={
        <>
          This action cannot be undone. This will permanently delete {numRows}{" "}
          selected {numRows === 1 ? "row" : "rows"}.
        </>
      }
      onConfirm={onDelete}
    >
      <Button className='ml-auto' variant='outline'>
        <TrashIcon className='-ms-1 opacity-60' size={16} aria-hidden='true' />
        Delete
        <span className='-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70'>
          {table.getSelectedRowModel().rows.length}
        </span>
      </Button>
    </ConfirmDialog>
  );
}
