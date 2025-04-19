import { AppLayout } from "@/components/app-layout/AppLayout";
import { CourseInfoForm } from "./CreateCourseForm";

export function CreateCoursePage() {
  return (
    <AppLayout title="Add a new Course">
      <div className='px-8 pb-24'>
        <h1 className='mb-6 text-3xl font-bold'>Create New Course</h1>

        <CourseInfoForm />
      </div>
    </AppLayout>
  );
}
