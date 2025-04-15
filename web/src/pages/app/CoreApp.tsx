import { Route, Routes } from "react-router";
import { DashboardPage } from "./dashboard/DashboardPage";
import { DataTablePage } from "./datatable/DataTablePage";
import { ComplexFormPage } from "./form/ComplexFormPage";

export function CoreApp() {
  return (
    <Routes>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/table' element={<DataTablePage />} />
      <Route path='/form' element={<ComplexFormPage />} />
    </Routes>
  );
}
