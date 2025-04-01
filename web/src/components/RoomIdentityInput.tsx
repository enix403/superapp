import clsx from "clsx";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { useRef, useState } from "react";
import { appRoomTypes, idToNodeType, isDoor, RoomTypeId } from "@/lib/nodes";
import { appNodeStyle } from "@/lib/node-styles";

export function RoomIdentityInput({
  initialName,
  initialTypeId,
  onUpdateName,
  onUpdateNodeType,
  className
}: {
  initialName: string;
  initialTypeId: string;
  onUpdateName: (name: string) => void;
  onUpdateNodeType: (typeId: RoomTypeId) => void;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);
  const [typeId, setTypeId] = useState(initialTypeId);

  const isRoom = !isDoor(typeId);

  function saveName() {
    onUpdateName(name);
  }

  function saveType(typeId: RoomTypeId) {
    onUpdateNodeType(typeId);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      saveName();
      ref.current?.blur();
    }
  }

  const selectedStyle = appNodeStyle[typeId] || null;

  return (
    <div className={clsx("flex rounded-md shadow-xs", className)}>
      <Select
        disabled={!isRoom}
        value={typeId}
        onValueChange={(v: RoomTypeId) => {
          setTypeId(v);
          saveType(v);
        }}
      >
        <SelectTrigger className='w-fit rounded-e-none shadow-none'>
          <SelectValue>
            {selectedStyle && (
              <selectedStyle.Icon
                size={18}
                color={selectedStyle.iconColor}
                strokeWidth={3}
              />
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className='[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0'>
          <SelectGroup>
            <SelectLabel>Select Room Type</SelectLabel>

            {appRoomTypes.map(roomType => {
              const style = appNodeStyle[roomType.id];
              return (
                <SelectItem key={roomType.id} value={roomType.id}>
                  <style.Icon size={16} color={style.iconColor} />
                  <span className='truncate'>{roomType.title}</span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        ref={ref}
        className='-ms-px rounded-s-none shadow-none focus-visible:z-10'
        placeholder='Room Name'
        type='text'
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={saveName}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
