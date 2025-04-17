import { ComponentType, createContext } from "react";

export type SideRouteItem = {
  path: string,
  label: string,
  Icon: ComponentType<any>,
  Comp: ComponentType<any>,
};

export const SideRoutesProvider = createContext<SideRouteItem[]>([]);
