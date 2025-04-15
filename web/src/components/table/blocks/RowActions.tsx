import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export function RowActions({ children }: PropsWithChildren) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex justify-end'>
          <Button
            size='icon'
            variant='ghost'
            className='shadow-none'
            aria-label='Edit item'
          >
            <EllipsisIcon size={16} aria-hidden='true' />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
