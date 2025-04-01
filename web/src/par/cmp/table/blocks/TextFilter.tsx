import { type Table as TableInstance } from "@tanstack/react-table";
import { useId, useRef } from "react";
import { CircleXIcon, ListFilterIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/*
filterFn: (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.fullName} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
}
*/

export function TextFilter<Item>({
  table,
  placeholder,
  columnName
}: {
  table: TableInstance<Item>;
  columnName: string;
  placeholder?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const col = table.getColumn(columnName);

  return (
    <div className='relative'>
      <Input
        id={`${id}-input`}
        ref={inputRef}
        className={cn(
          "peer min-w-60 ps-9",
          Boolean(col?.getFilterValue()) && "pe-9"
        )}
        value={(col?.getFilterValue() ?? "") as string}
        onChange={e => col?.setFilterValue(e.target.value)}
        placeholder={placeholder}
      />
      <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
        <ListFilterIcon size={16} aria-hidden='true' />
      </div>
      {Boolean(col?.getFilterValue()) && (
        <button
          className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          aria-label='Clear filter'
          onClick={() => {
            col?.setFilterValue("");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <CircleXIcon size={16} aria-hidden='true' />
        </button>
      )}
    </div>
  );
}
