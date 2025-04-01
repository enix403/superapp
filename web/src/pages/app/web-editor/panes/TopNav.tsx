import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { atom, useAtom } from "jotai";

import {
  Box,
  ChevronDownIcon,
  Map,
  Settings,
  Sparkle,
  Waypoints
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { LogOutIcon, PinIcon } from "lucide-react";
import { Link } from "react-router";
import { AvatarDropdown } from "@/components/topnav/AvatarDropdown";
import { Separator } from "@/components/ui/separator";

export const activeTabAtom = atom<"layout" | "2d" | "3d">("2d");

export function MainDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' className='h-auto w-auto py-3'>
          <Sparkle className='!h-5 !w-5' />
          <ChevronDownIcon className='opacity-60' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='max-w-64'>
        <DropdownMenuLabel className='flex items-start gap-3'>
          <img
            src='/profile_img_01.png'
            alt='Avatar'
            width={32}
            height={32}
            className='aspect-square shrink-0 rounded-full'
          />
          <div className='flex min-w-0 flex-col'>
            <span className='truncate text-sm font-medium text-foreground'>
              Keith Kennedy
            </span>
            <span className='truncate text-xs font-normal text-muted-foreground'>
              k.kennedy@originui.com
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon size={16} className='opacity-60' aria-hidden='true' />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant='destructive'>
          <Link to='/auth/logout'>
            <LogOutIcon size={16} className='opacity-60' aria-hidden='true' />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopNav() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  return (
    <nav className='flex border-b px-4 py-4'>
      <div className='flex flex-1 items-center'>
        {/* <MainDropdown /> */}

        <Button variant='ghost' className='py-4'>
          <p className='max-w-40 overflow-hidden text-ellipsis'>
            <span className='text-gray-500'>Projects / </span>
            My Plan 1
          </p>
          <ChevronDownIcon
            className='-me-1 opacity-60'
            size={16}
            aria-hidden='true'
          />
        </Button>
      </div>
      <div className='flex flex-1 items-center justify-center'>
        <ToggleGroup
          variant='outline'
          size='lg'
          className='inline-flex'
          type='single'
          value={activeTab}
          onValueChange={setActiveTab as any}
        >
          <ToggleGroupItem value='layout'>
            Layout Graph <Waypoints />
          </ToggleGroupItem>
          <ToggleGroupItem value='2d'>
            2D View <Map />
          </ToggleGroupItem>
          <ToggleGroupItem value='3d'>
            3D View <Box />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className='flex flex-1 items-center justify-end'>
        <Button size='lg' className='mr-2'>
          Export
        </Button>
        <Button variant='outline' size='icon' className="mr-0.5">
          <Settings />
        </Button>
        <Separator
          orientation='vertical'
          className='mx-3 !h-6 bg-[#d8dae2]'
        />
        <AvatarDropdown />
      </div>
    </nav>
  );
}
