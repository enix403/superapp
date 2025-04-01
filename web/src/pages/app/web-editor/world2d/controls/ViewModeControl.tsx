import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useSetSettings, useSettings } from "../state/settings";

export function ViewModeControl() {
  const { viewMode } = useSettings();
  const setSettings = useSetSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Palette size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select View Mode</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={viewMode}
          onValueChange={viewMode => setSettings({ viewMode: viewMode as any })}
        >
          <DropdownMenuRadioItem value='color'>Color</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='wireframe'>
            Wireframe
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
