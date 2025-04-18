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
import { ImageFormsPage } from "./form/ImageFormsPage";
import { AsyncSelectPage } from "./dashboard/AsyncSelectPage";
import { MiscPage } from "./dashboard/MiscPage";
import { SortableGridPage } from "./dashboard/SortableGridPage";
import { ProfilePage } from "./profile/ProfilePage";

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
    path: "/live-select",
    label: "Live Select",
    Icon: Frame,
    Comp: AsyncSelectPage
  },
  {
    path: "/sort-grid",
    label: "Sortable Grid",
    Icon: Frame,
    Comp: SortableGridPage
  },
  {
    path: "/misc",
    label: "Misc",
    Icon: Frame,
    Comp: MiscPage
  },
  {
    path: "/form",
    label: "Complex Form",
    Icon: Frame,
    Comp: ComplexFormPage
  },
  {
    path: "/image-form",
    label: "Image Form",
    Icon: Frame,
    Comp: ImageFormsPage
  },
  {
    path: "/profile",
    label: "My Profile",
    Icon: Frame,
    Comp: ProfilePage
  }
];

export function CoreApp() {
  return (
    <SideRoutesProvider.Provider value={items}>
      <Routes>
        {items.map(({ path, Comp }) => (
          <Route key={path} path={path} element={<Comp />} />
        ))}
      </Routes>
    </SideRoutesProvider.Provider>
  );
}
