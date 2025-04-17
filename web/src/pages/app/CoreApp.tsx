import { Route, Routes } from "react-router";
import { DashboardPage } from "./dashboard/DashboardPage";
import { DataTablePage } from "./datatable/DataTablePage";
import { ComplexFormPage } from "./form/ComplexFormPage";
import { ScratchPage } from "./_scratch/ScratchPage";
import { Frame } from "lucide-react";
import {
  SideRouteItem,
  SideRoutesProvider
} from "@/components/app-layout/sidebar/SideRoutesProvider";

const items: SideRouteItem[] = [
  {
    path: "/s",
    label: "Scratch",
    Icon: Frame,
    Comp: ScratchPage
  },
  {
    path: "/",
    label: "Dashboard",
    Icon: Frame,
    Comp: DashboardPage
  },
  {
    path: "/table",
    label: "Data Table",
    Icon: Frame,
    Comp: DataTablePage
  },
  {
    path: "/form",
    label: "Complex Form",
    Icon: Frame,
    Comp: ComplexFormPage
  }
];

export function CoreApp() {
  return (
    <SideRoutesProvider.Provider value={items}>
      <Routes>
        {items.map(({ path, Comp }) => (
          <Route path={path} element={<Comp />} />
        ))}
      </Routes>
    </SideRoutesProvider.Provider>
  );
}
