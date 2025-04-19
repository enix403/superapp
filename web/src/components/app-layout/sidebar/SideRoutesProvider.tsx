import { ComponentType, createContext } from "react";

export type SideRouteItem = {
  path: string,
  label: string,
  Icon: ComponentType<any>,
  Comp: ComponentType<any>,
  hide?: boolean;
};

export const SideRoutesProvider = createContext<SideRouteItem[]>([]);
