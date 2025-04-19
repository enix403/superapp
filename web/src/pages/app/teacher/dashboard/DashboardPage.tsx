import { AppLayout } from "@/components/app-layout/AppLayout";
import { CoursesTable } from "./CoursesTable";

export function DashboardPage() {
  return (
    <AppLayout title='Dashboard'>
      <CoursesTable />
    </AppLayout>
  );
}
