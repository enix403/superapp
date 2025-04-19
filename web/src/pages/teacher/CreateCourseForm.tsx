import type React from "react";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  Trash2,
  Upload,
  X,
  PlusCircle,
  Save,
  Loader2
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import { uploadFiles } from "@/components/form/file-input/uploading";
import { AppLayout } from "@/components/app-layout/AppLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SimpleFormItem } from "@/components/form/SimpleFormItem";
import { categories } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { apiRoutes } from "@/lib/api-routes";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  desc: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().nonempty(),
  thumbnail: z.string().optional(),
  videos: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(3, "Video title must be at least 3 characters"),
        desc: z.string(),
        videoUrl: z.string().optional()
      })
    )
    .min(1, "Add at least one video to your course")
});

type FormValues = z.infer<typeof formSchema>;

interface VideoFile {
  file: File | null;
  previewUrl: string | null;
  videoUrl: string | null;
  isUploading: boolean;
}

export function CourseInfoForm({ course }: { course?: any }) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [videoFiles, setVideoFiles] = useState<Record<string, VideoFile>>({});
  const [isDragging, setIsDragging] = useState(false);

  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: course || {
      title: "",
      category: categories[0],
      desc: "",
      thumbnail: "",
      videos: []
    }
  });

  useEffect(() => {
    if (course.thumbnail)
      setThumbnailPreview(course.thumbnail);
  }, [course]);

  useEffect(() => {
    if (course.videos)
      setVideoFiles(course.videos.map(v => ({
        file: null,
        previewUrl: v.videoUrl,
        videoUrl: v.videoUrl,
        isUploading: false,
    })));
  }, [course]);

  // Setup field array for videos
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "videos"
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file automatically
      try {
        setIsUploadingThumbnail(true);
        const urls = await uploadFiles([file]);
        setThumbnailUrl(urls[0]);
        form.setValue("thumbnail", urls[0]);
        toast.success("Thumbnail uploaded successfully");
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        toast.error("Upload failed");
      } finally {
        setIsUploadingThumbnail(false);
      }
    }
  };

  const handleAddVideo = () => {
    const newVideoId = `video-${Date.now()}`;
    append({
      id: newVideoId,
      title: "",
      desc: "",
      videoUrl: ""
    });
    setVideoFiles({
      ...videoFiles,
      [newVideoId]: {
        file: null,
        previewUrl: null,
        videoUrl: null,
        isUploading: false
      }
    });
  };

  const handleDeleteVideo = (index: number, id: string) => {
    remove(index);

    // Also remove from videoFiles state
    const updatedVideoFiles = { ...videoFiles };
    delete updatedVideoFiles[id];
    setVideoFiles(updatedVideoFiles);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setIsDragging(false);

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(item => item.id === active.id);
      const newIndex = fields.findIndex(item => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const onSubmit = async (data: FormValues) => {
    // Check if all videos have been uploaded
    const allVideosUploaded = fields.every((field, index) => {
      const videoUrl = form.getValues(`videos.${index}.videoUrl`);
      return videoUrl && videoUrl.length > 0;
    });

    if (!allVideosUploaded) {
      toast.error("Videos still uploading");
      return;
    }

    // API call would go here
    try {
      // INTEGRATION POINT: API call to create course
      console.log(data);
      data.videos.forEach(v => {
        // @ts-ignore
        delete v['id'];
      });
      if (!course) {
        await apiRoutes.createCourse(data);
      }
      else {
        await apiRoutes.updateCourse(data, course.id);
      }

      console.log("Form submitted successfully");

      toast.success("Course created");
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Submission Failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardContent className='pt-0'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter course title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='category'
                render={({ field }) => (
                  <SimpleFormItem label='Course Category' noControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </SimpleFormItem>
                )}
              />

              <FormField
                control={form.control}
                name='desc'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>
                      Course Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter course description'
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label htmlFor='thumbnail' className='text-base'>
                  Course Thumbnail
                </Label>
                <label htmlFor='thumbnail' className='block cursor-pointer'>
                  <input
                    id='thumbnail'
                    type='file'
                    accept='image/*'
                    onChange={handleThumbnailChange}
                    className='hidden'
                    disabled={isUploadingThumbnail}
                  />
                  <div className='flex items-center gap-4'>
                    <div className='relative h-40 w-72 overflow-hidden rounded-md border border-input bg-muted'>
                      {thumbnailPreview ? (
                        <>
                          <img
                            src={thumbnailPreview || "/placeholder.svg"}
                            alt='Thumbnail preview'
                            className='h-full w-full object-cover'
                          />
                          {isUploadingThumbnail && (
                            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                              <Loader2 className='h-8 w-8 animate-spin text-white' />
                            </div>
                          )}
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute top-2 right-2 h-8 w-8'
                            onClick={e => {
                              e.stopPropagation(); // prevent triggering the file picker
                              setThumbnailFile(null);
                              setThumbnailPreview(null);
                              setThumbnailUrl(null);
                              form.setValue("thumbnail", "");
                            }}
                            disabled={isUploadingThumbnail}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </>
                      ) : (
                        <div className='flex h-full w-full items-center justify-center'>
                          <Upload className='h-8 w-8 text-muted-foreground' />
                        </div>
                      )}
                    </div>
                    <div>
                      <Button
                        type='button'
                        variant='outline'
                        disabled={isUploadingThumbnail}
                      >
                        {isUploadingThumbnail ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Uploading...
                          </>
                        ) : thumbnailPreview ? (
                          "Change Thumbnail"
                        ) : (
                          "Select Thumbnail"
                        )}
                      </Button>
                      {thumbnailUrl && (
                        <p className='mt-2 text-xs text-muted-foreground'>
                          Uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Course Videos</h2>
            <Button
              type='button'
              onClick={handleAddVideo}
              variant='outline'
              className='gap-2'
            >
              <PlusCircle className='h-4 w-4' />
              Add Video
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className='rounded-lg border border-dashed py-12 text-center'>
              <Upload className='mx-auto h-12 w-12 text-muted-foreground' />
              <p className='mt-2 text-muted-foreground'>
                No videos added yet. Click "Add Video" to get started.
              </p>
              {form.formState.errors.videos?.root && (
                <p className='mt-2 text-destructive'>
                  {form.formState.errors.videos.root.message}
                </p>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-4'>
                  {fields.map((video, index) => (
                    <SortableVideoItem
                      key={video.id}
                      video={video}
                      index={index}
                      control={form.control}
                      setVideoFiles={setVideoFiles}
                      videoFile={
                        videoFiles[video.id] || {
                          file: null,
                          previewUrl: null,
                          videoUrl: null,
                          isUploading: false
                        }
                      }
                      onDelete={() => handleDeleteVideo(index, video.id)}
                      isDragging={isDragging}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <div className='flex justify-end gap-4'>
          <Button type='button' variant='outline'>
            Cancel
          </Button>
          <Button
            type='submit'
            className='gap-2'
            disabled={
              form.formState.isSubmitting ||
              Object.values(videoFiles).some(v => v.isUploading) ||
              isUploadingThumbnail
            }
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='h-4 w-4' />
                Save Course
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CreateCoursePage() {
  return (
    <AppLayout>
      <div className='px-8 pb-24'>
        <h1 className='mb-6 text-3xl font-bold'>Create New Course</h1>

        <CourseInfoForm />
      </div>
    </AppLayout>
  );
}

export function EditCoursePage() {
  const { courseId } = useParams();

  const { data: course, isError } = useQuery<FormValues>({
    queryKey: ["course", courseId],
    queryFn: () => apiRoutes.getCourse(courseId!)
  });

  return (
    <AppLayout>
      <div className='px-8 pb-24'>
        <h1 className='mb-6 text-3xl font-bold'>Edit Course</h1>

        {course && !isError && <CourseInfoForm course={course} />}
      </div>
    </AppLayout>
  );
}

interface SortableVideoItemProps {
  video: any;
  index: number;
  control: any;
  videoFile: {
    file: File | null;
    previewUrl: string | null;
    videoUrl: string | null;
    isUploading: boolean;
  };
  setVideoFiles: React.Dispatch<
    React.SetStateAction<Record<string, VideoFile>>
  >;
  onDelete: () => void;
  isDragging: boolean;
}

function SortableVideoItem({
  video,
  index,
  control,
  videoFile,
  onDelete,
  isDragging,
  setVideoFiles
}: SortableVideoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        setVideoFiles(prev => ({
          ...prev,
          [video.id]: {
            ...prev[video.id],
            file,
            previewUrl: reader.result as string,
            isUploading: true
          }
        }));
      };
      reader.readAsDataURL(file);

      try {
        const urls = await uploadFiles([file]);
        const videoUrl = urls[0];

        // Set video URL in form
        control._formValues.videos[index].videoUrl = videoUrl;

        setVideoFiles(prev => ({
          ...prev,
          [video.id]: {
            ...prev[video.id],
            videoUrl,
            isUploading: false
          }
        }));

        toast.success("Video uploaded successfully");
      } catch (error) {
        console.error("Error uploading video:", error);
        setVideoFiles(prev => ({
          ...prev,
          [video.id]: {
            ...prev[video.id],
            isUploading: false
          }
        }));
        toast.error("Upload failed");
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border ${isDragging ? "border-primary" : "border-input"}`}
    >
      <div className='p-4'>
        <div className='mb-4 flex items-center gap-2'>
          <div
            {...attributes}
            {...listeners}
            className='cursor-grab rounded p-2 hover:bg-muted'
          >
            <GripVertical className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='flex-1'>
            <Controller
              name={`videos.${index}.title`}
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    {...field}
                    placeholder='Video title'
                    className={`font-medium ${fieldState.error ? "border-destructive" : ""}`}
                  />
                  {fieldState.error && (
                    <p className='mt-1 text-sm text-destructive'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <Button
            type='button'
            variant='destructive'
            size='icon'
            onClick={onDelete}
            className='h-8 w-8'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <Label htmlFor={`video-file-${video.id}`} className='mb-2 block'>
              Video File
            </Label>
            <label
              htmlFor={`video-file-${video.id}`}
              className='block cursor-pointer'
            >
              <input
                id={`video-file-${video.id}`}
                type='file'
                accept='image/*'
                onChange={handleVideoChange}
                className='hidden'
                disabled={videoFile.isUploading}
              />
              <div className='relative h-[180px] overflow-hidden rounded-md border border-input bg-muted'>
                {videoFile.previewUrl ? (
                  <>
                    <img
                      src={videoFile.previewUrl}
                      className='h-full w-full object-cover'
                      // controls
                    />
                    {videoFile.isUploading && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                        <Loader2 className='h-8 w-8 animate-spin text-white' />
                      </div>
                    )}
                  </>
                ) : (
                  <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
                    <Upload className='h-8 w-8 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>
                      Select video file
                    </p>
                  </div>
                )}
              </div>
            </label>

            <div className='mt-2 flex items-center'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={videoFile.isUploading}
              >
                {videoFile.isUploading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Uploading...
                  </>
                ) : videoFile.file ? (
                  "Replace Video"
                ) : (
                  "Select Video"
                )}
              </Button>
              {videoFile.videoUrl && !videoFile.isUploading && (
                <span className='ml-2 text-xs text-muted-foreground'>
                  Uploaded successfully
                </span>
              )}
            </div>
          </div>

          <div>
            <Controller
              name={`videos.${index}.desc`}
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={`video-desc-${video.id}`}
                    className='mb-2 block'
                  >
                    Video Description
                  </Label>
                  <Textarea
                    id={`video-desc-${video.id}`}
                    {...field}
                    placeholder='Enter video description'
                    className='min-h-[140px]'
                  />
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
