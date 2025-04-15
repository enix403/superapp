import {
  FilterFn, type Table as TableInstance
} from "@tanstack/react-table";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useId, useMemo } from "react";

export function uniqueValuesFilterFn<T>() {
  const filterFn: FilterFn<T> = (row, columnId, filterValue: string[]) => {
    if (!filterValue?.length) return true;
    const status = row.getValue(columnId) as string;
    return filterValue.includes(status);
  };
  return filterFn;
}

export function UniqueValuesFilter<Item>({
  table,
  columnName
}: {
  table: TableInstance<Item>;
  columnName: string;
}) {
  const id = useId();

  // Get unique values
  const uniqueValues = useMemo(() => {
    const col = table.getColumn(columnName);
    if (!col) return [];

    return Array.from(col.getFacetedUniqueValues().keys()).sort();
  }, [columnName, table.getColumn(columnName)?.getFacetedUniqueValues()]);

  // Get counts for each unique value
  const uniqueCounts = useMemo(() => {
    const col = table.getColumn(columnName);
    if (!col) return new Map();

    return col.getFacetedUniqueValues();
  }, [columnName, table.getColumn(columnName)?.getFacetedUniqueValues()]);

  const selectedValues = useMemo(() => {
    const filterValue = table
      .getColumn(columnName)
      ?.getFilterValue() as string[];

    return filterValue ?? [];
  }, [columnName, table.getColumn(columnName)?.getFilterValue()]);

  const handleCheckChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn(columnName)
      ?.getFilterValue() as string[];

    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn(columnName)
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <FilterIcon
            className='-ms-1 opacity-60'
            size={16}
            aria-hidden='true'
          />
          {table.getColumn(columnName)?.columnDef.header?.toString() ?? ""}
          {selectedValues.length > 0 && (
            <span className='-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70'>
              {selectedValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto min-w-36 p-3' align='start'>
        <div className='space-y-3'>
          <div className='text-xs font-medium text-muted-foreground'>
            Filters
          </div>
          <div className='space-y-3'>
            {uniqueValues.map((value, i) => (
              <div key={value} className='flex items-center gap-2'>
                <Checkbox
                  id={`${id}-${i}`}
                  checked={selectedValues.includes(value)}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckChange(checked, value)
                  }
                />
                <Label
                  htmlFor={`${id}-${i}`}
                  className='flex grow justify-between gap-2 font-normal'
                >
                  {value}
                  <span className='ms-2 text-xs text-muted-foreground'>
                    {uniqueCounts.get(value)}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
