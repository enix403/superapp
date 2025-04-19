import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Course {
  id: number;
  title: string;
  instructor: string;
  desc: string;
  category: string;
  enrollments: number;
  image: string;
}

interface FormValues {
  searchTerm: string;
  category: string;
  level: string;
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      searchTerm: "",
      category: "All",
      level: "All"
    }
  });

  const searchTerm = watch("searchTerm");
  const category = watch("category");
  const level = watch("level");

  const categories = [
    "All",
    "Mathematics",
    "Science",
    "History",
    "Computer Science",
    "Social Sciences",
    "Arts"
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  // INTEGRATION POINT: Replace with actual API call to fetch initial courses
  const getCourses = async (): Promise<Course[]> => {
    const data: Course[] = [
      {
        id: 1,
        title: "Introduction to Mathematics",
        instructor: "Dr. Jane Smith",
        desc: "A fundamental course covering basic mathematical concepts.",
        category: "Mathematics",
        enrollments: 920,
        image:
          "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWF0aHxlbnwwfHwwfHx8MA%3D%3D"
      },
      {
        id: 2,
        title: "Web Development Fundamentals",
        instructor: "Sarah Williams",
        desc: "Learn HTML, CSS, and JavaScript to build websites.",
        category: "Computer Science",
        enrollments: 920,
        image:
          "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcHV0ZXIlMjBzY2llbmNlfGVufDB8fDB8fHww"
      },
      {
        id: 3,
        title: "Creative Writing Workshop",
        instructor: "Emma Roberts",
        desc: "Develop your creative writing skills.",
        category: "Arts",
        enrollments: 920,
        image:
          "https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ];
    setCourses(data);
    return data;
  };

  // INTEGRATION POINT: Replace with real-time search API
  const searchCourses = async ({ searchTerm, category, level }: FormValues) => {
    const allCourses = await getCourses(); // Replace with API call
    let filtered = allCourses;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(term) ||
          c.desc.toLowerCase().includes(term) ||
          c.instructor.toLowerCase().includes(term)
      );
    }

    if (category !== "All") {
      filtered = filtered.filter(c => c.category === category);
    }

    setCourses(filtered);
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    searchCourses({ searchTerm, category, level });
  }, [searchTerm, category, level]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Explore Courses</h1>

      {/* Search bar */}
      <div className='relative mb-8'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <Input
          type='text'
          placeholder='Search for courses, topics, or instructors...'
          className='w-full pl-10'
          {...register("searchTerm")}
        />
      </div>

      {/* Filters */}
      <div className='mb-8'>
        <Tabs defaultValue='categories' className='w-full'>
          <div className='flex flex-wrap gap-2'>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={category === cat ? "default" : "outline"}
                className='cursor-pointer'
                onClick={() => setValue("category", cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
          <TabsContent value='levels' className='rounded-b-lg bg-gray-50 p-4'>
            <div className='flex flex-wrap gap-2'>
              {levels.map(lev => (
                <Badge
                  key={lev}
                  variant={level === lev ? "default" : "outline"}
                  className='cursor-pointer'
                  onClick={() => setValue("level", lev)}
                >
                  {lev}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Course listing */}
      {courses.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {courses.map(course => (
            <Card
              key={course.id}
              className='cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg'
              onClick={() => alert(`Navigate to course ${course.id}`)}
            >
              <img
                src={course.image}
                alt={course.title}
                className='h-48 w-full object-cover'
              />
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <CardTitle className='text-lg'>{course.title}</CardTitle>
                </div>
                <p className='text-sm text-gray-500'>by {course.instructor}</p>
              </CardHeader>
              <CardContent className='pb-2'>
                <p className='line-clamp-2 text-sm text-gray-600'>
                  {course.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12'>
          <div className='text-center'>
            <h3 className='mb-2 text-lg font-medium'>No courses found</h3>
            <p className='mb-6 text-gray-500'>
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => reset()} disabled={isSubmitting}>
              Reset filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
