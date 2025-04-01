import urlJoin from "url-join";
import { Frame } from "lucide-react";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { NavLink, Link, useLocation, useMatch } from "react-router";
import { unslashEnd } from "@/lib/utils";

const items = [
  {
    path: "/",
    label: "My Designs",
    Icon: Frame
  }
];

type SidebarItem = (typeof items)[number];

function AppSidebarItem({ item }: { item: SidebarItem }) {
  const path = unslashEnd(urlJoin("/app", item.path));
  const isActive = useMatch(path);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={Boolean(isActive)}
        tooltip='My Designs'
        asChild
      >
        <Link to={path}>
          <item.Icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        {/*  */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.map(item => (
              <AppSidebarItem key={item.path} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/*  */}
      </SidebarContent>
    </Sidebar>
  );
}
