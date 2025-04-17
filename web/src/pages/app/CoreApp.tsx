import { Route, Routes } from "react-router";
import { DashboardPage } from "./dashboard/DashboardPage";
import { DataTablePage } from "./datatable/DataTablePage";
import { ComplexFormPage } from "./form/ComplexFormPage";
import { ScratchPage } from "./_scratch/ScratchPage";

export function CoreApp() {
  return (
    <Routes>
      <Route path='/s' element={<ScratchPage />} />
      <Route path='/' element={<DashboardPage />} />
      <Route path='/table' element={<DataTablePage />} />
      <Route path='/form' element={<ComplexFormPage />} />
    </Routes>
  );
}
