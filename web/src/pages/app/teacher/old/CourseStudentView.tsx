import { useEffect, useState } from "react";
import { ChevronLeft, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "react-router";
import { AppLayout } from "@/components/app-layout/AppLayout";
import { apiRoutes } from "@/lib/api-routes";

interface teacherId {
  id: number;
  fullName: string;
  profilePictureUrl: string;
  bio: string;
}

interface Video {
  id: number;
  title: string;
  desc: string;
  videoUrl: string;
}

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  desc: string;
  enrollments: number;
  teacherId: teacherId;
  videos: Video[];
}

export function CourseStudentView() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (courseId) {
      // Replace with actual API call
      getCourseById(courseId);
    }
  }, [courseId]);

  const getCourseById = async (id: string) => {
    // Dummy data for simulation
    // const fetchedCourse: Course = {
    //   id,
    //   title: "Advanced Web Development with React",
    //   thumbnail: "https://source.unsplash.com/1200x400/?react,code",
    //   desc: "Master modern web development techniques using React...",
    //   enrollments: 1742,
    //   teacherId: {
    //     id: 101,
    //     fullName: "Dr. Rebecca Chen",
    //     profilePictureUrl: "https://source.unsplash.com/150x150/?portrait,woman",
    //     bio: "With over 10 years of experience..."
    //   },
    //   videos: [
    //     {
    //       id: 1,
    //       title: "Introduction to the Course",
    //       desc: "Overview of what we'll cover...",
    //       videoUrl: "TEMP"
    //     },
    //     {
    //       id: 2,
    //       title: "React Fundamentals Review",
    //       desc: "A quick refresher on React components...",
    //       videoUrl: "TEMP"
    //     }
    //     // Add more as needed
    //   ]
    // };
    const fetchedCourse = await apiRoutes.getCourse(id);
    console.log(fetchedCourse);

    setCourse(fetchedCourse);
  };

  const handleteacherIdClick = () => {
    if (course)
      alert(`Navigating to ${course.teacherId.fullName}'s profile page`);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  if (!course) return <p className='p-8'>Loading course...</p>;

  return (
    <AppLayout title='View Course'>
      <div className='mx-auto px-10 py-8'>
        <Button
          variant='ghost'
          className='mb-6 flex items-center gap-1'
          onClick={() => alert("Navigating back to course catalog")}
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Courses
        </Button>

        <div className='mb-5 flex items-center justify-between rounded-xl bg-gray-50 p-6'>
          <div>
            <p className='mb-1 text-lg font-medium'>Ready to start learning?</p>
            <p className='text-gray-600'>
              Join {course.enrollments ?? 0} students already enrolled
            </p>
          </div>
          <Button size='lg'>Enroll Now</Button>
        </div>

        <div className='relative mb-8 h-64 w-full overflow-hidden rounded-xl md:h-80'>
          <img
            src={course.thumbnail}
            alt={course.title}
            className='h-full w-full object-cover'
          />
        </div>

        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <h1 className='mb-4 text-3xl font-bold'>{course.title}</h1>
            <p className='mb-4 text-gray-700'>{course.desc}</p>

            <div className='mb-6 flex items-center gap-2 text-sm text-gray-500'>
              <span className='flex items-center'>
                <Users className='mr-1 h-4 w-4' />
                {course.enrollments ?? 0} students enrolled
              </span>
            </div>
          </div>

          <div className='rounded-xl bg-gray-50 p-6'>
            <div
              className='mb-4 flex cursor-pointer items-center gap-4'
              onClick={handleteacherIdClick}
            >
              <Avatar className='h-16 w-16 border-2 border-primary'>
                <AvatarImage
                  src={course.teacherId.profilePictureUrl}
                  alt={course.teacherId.fullName}
                />
                <AvatarFallback>
                  {course.teacherId.fullName
                    .split(" ")
                    .map(n => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='font-medium'>{course.teacherId.fullName}</h3>
              </div>
            </div>
            <p className='text-sm text-gray-600'>{course.teacherId.bio}</p>
          </div>
        </div>

        <h1>Course Content</h1>

        <h2 className='mb-4 text-xl font-semibold'>Course Videos</h2>
        <div className='grid grid-cols-1 gap-6'>
          {selectedVideo && (
            <div className='mb-8'>
              <div className='mb-4 aspect-video overflow-hidden rounded-lg bg-gray-900'>
                <div className='flex h-full w-full items-center justify-center text-white'>
                  <div className='text-center'>
                    <Play className='mx-auto mb-2 h-16 w-16' />
                    <p>Video Player: {selectedVideo.title}</p>
                  </div>
                </div>
              </div>
              <h3 className='mb-2 text-lg font-medium'>
                {selectedVideo.title}
              </h3>
              <p className='text-gray-600'>{selectedVideo.desc}</p>
            </div>
          )}

          {course.videos.map(video => (
            <Card
              key={video.id}
              className={`cursor-pointer overflow-hidden transition-shadow hover:shadow-md ${selectedVideo?.id === video.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleVideoSelect(video)}
            >
              <div className='flex flex-col sm:flex-row'>
                <div className='relative h-36 w-full sm:w-48'>
                  <img
                    src={video.videoUrl}
                    className='h-full w-full object-cover'
                    // controls
                  />
                </div>
                <CardContent className='flex-1 p-4'>
                  <h3 className='mb-2 font-medium'>{video.title}</h3>
                  <p className='text-sm text-gray-600'>{video.desc}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
