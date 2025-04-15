import { Route, Routes } from "react-router";
import { DashboardPage } from "./dashboard/DashboardPage";

export function CoreApp() {
  return (
    <Routes>
      <Route path='/' element={<DashboardPage />} />
    </Routes>
  );
}
