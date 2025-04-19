import { AppLayout } from "@/components/app-layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { apiRoutes } from "@/lib/api-routes";
import { CourseInfoForm } from "./CreateCourseForm";

export function EditCoursePage() {
  const { courseId } = useParams();

  const { data: course, isError } = useQuery<any>({
    queryKey: ["course", courseId],
    queryFn: () => apiRoutes.getCourse(courseId!)
  });

  return (
    <AppLayout title='Edit Course'>
      <div className='px-8 pb-24'>
        <h1 className='mb-6 text-3xl font-bold'>Edit Course</h1>

        {course && !isError && <CourseInfoForm course={course} />}
      </div>
    </AppLayout>
  );
}
