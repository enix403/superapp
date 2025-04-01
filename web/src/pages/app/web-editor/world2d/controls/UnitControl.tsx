import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DraftingCompass } from "lucide-react";
import { useSetSettings, useSettings } from "../state/settings";

export function UnitControl() {
  const { unit } = useSettings();
  const setSettings = useSetSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost'>
          <DraftingCompass size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select Unit</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={unit}
          onValueChange={unit => setSettings({ unit: unit as any })}
        >
          <DropdownMenuRadioItem value='ft'>Feet</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='m'>Meters</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='in'>Inches</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
