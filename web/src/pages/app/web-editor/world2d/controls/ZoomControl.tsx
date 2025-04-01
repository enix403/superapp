import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Binoculars, ChevronDownIcon, ZoomIn } from "lucide-react";

import { sendEditorCommand } from "../state/commands";
import { useZoomLevel } from "../state/settings";

export function ZoomControl() {
  const zoomLevel = useZoomLevel();

  function applyZoom(value: number) {
    sendEditorCommand({
      type: "set-zoom",
      zoomPercent: value
    });
  }

  const selectableZoomLevels = [70, 80, 100, 110, 120, 140, 180, 200];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary'>
          <ZoomIn className='me-1' size={18} />
          <p className='w-10'>{Math.round(zoomLevel * 100)}%</p>
          <ChevronDownIcon
            className='-me-1 opacity-60'
            size={16}
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Zoom</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => applyZoom(100)}>
            <Binoculars size={16} className='opacity-60' aria-hidden='true' />
            Reset
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {selectableZoomLevels.map((level, index) => (
            <DropdownMenuItem key={index} onSelect={() => applyZoom(level)}>
              {level}%
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
