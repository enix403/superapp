import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Layers } from "lucide-react";
import { ReactNode } from "react";
import { Label } from "react-konva";

import { useSetSettings, useSettings } from "../state/settings";

function FeatureToggle({
  label,
  enabled,
  onChange
}: {
  label: ReactNode;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <DropdownMenuItem onSelect={e => e.preventDefault()} asChild>
      <Label className='justify-between'>
        <p className='mr-10'>{label}</p>
        <Switch checked={enabled} onCheckedChange={onChange} />
      </Label>
    </DropdownMenuItem>
  );
}

export function FeatureTogglesControl() {
  const { enableWallMeasure, enableRoomLabels } = useSettings();
  const setSettings = useSetSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Layers size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Toggle Features</DropdownMenuLabel>
        <DropdownMenuGroup>
          <FeatureToggle
            label='Wall Measurements'
            enabled={enableWallMeasure}
            onChange={enable => setSettings({ enableWallMeasure: enable })}
          />
          <FeatureToggle
            label='Room Labels'
            enabled={enableRoomLabels}
            onChange={enable => setSettings({ enableRoomLabels: enable })}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
