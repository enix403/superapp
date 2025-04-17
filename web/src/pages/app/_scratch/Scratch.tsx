"use client";

import { SimpleFormItem } from "@/components/form/SimpleFormItem";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger
} from "@/components/ui/file-upload";
import { FormField } from "@/components/ui/form";
import { useMaybeControlled } from "@/hooks/useMaybeControlled";
import { HashIcon, Upload, X } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { apiConn } from "@/lib/api-routes";
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";

function SingleImageUpload({
  value,
  onChange,
  disabled
}: {
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps
    }
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
    initialFiles:
      value?.map((file, index) => ({
        id: index.toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      })) ?? [],
    onFilesAdded: files => {
      onChange?.(files.map(file => (file.file as File)));
    }
  });

  const previewUrl = files[0]?.preview || null;

  return (
    <div className='flex flex-col gap-2'>
      <div className='relative'>
        {/* Drop area */}
        <div
          role='button'
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className='relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
        >
          <input
            {...getInputProps()}
            className='sr-only'
            aria-label='Upload file'
          />
          {previewUrl ? (
            <div className='absolute inset-0'>
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || "Uploaded image"}
                className='size-full object-cover'
              />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
              <div
                className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
                aria-hidden='true'
              >
                <ImageUpIcon className='size-4 opacity-60' />
              </div>
              <p className='mb-1.5 text-sm font-medium'>
                Drop your image here or click to browse
              </p>
              <p className='text-xs text-muted-foreground'>
                Max size: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
        {previewUrl && (
          <div className='absolute top-4 right-4'>
            <button
              type='button'
              className='z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
              onClick={() => removeFile(files[0]?.id)}
              aria-label='Remove image'
            >
              <XIcon className='size-4' aria-hidden='true' />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className='flex items-center gap-1 text-xs text-destructive'
          role='alert'
        >
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}

function FileUploadBlock({
  value,
  onChange,
  disabled
}: {
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
}) {
  const [filesT, setFiles] = useMaybeControlled<File[]>({
    value,
    onChange,
    defaultValue: []
  });

  const files = filesT!;

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`
    });
  }, []);

  /* const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      }
    ) => {
      try {
        // Process each file individually
        const uploadPromises = files.map(async file => {
          try {
            // Simulate file upload with progress
            const totalChunks = 10;
            let uploadedChunks = 0;

            // Simulate chunk upload with delays
            for (let i = 0; i < totalChunks; i++) {
              // Simulate network delay (100-300ms per chunk)
              await new Promise(resolve =>
                setTimeout(resolve, Math.random() * 200 + 100)
              );

              // Update progress for this specific file
              uploadedChunks++;
              const progress = (uploadedChunks / totalChunks) * 100;
              onProgress(file, progress);
            }

            // Simulate server processing delay
            await new Promise(resolve => setTimeout(resolve, 500));
            onSuccess(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
      } catch (error) {
        // This handles any error that might occur outside the individual upload processes
        console.error("Unexpected error during upload:", error);
      }
    },
    []
  ); */

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onFileReject={onFileReject}
      // onUpload={onUpload}
      accept='image/*'
      maxFiles={2}
      className='w-full'
      maxSize={2 * 1024 * 1024 /* 2MB */}
      multiple
      disabled={disabled}
    >
      <FileUploadDropzone>
        <div className='flex flex-col items-center gap-1'>
          <div className='flex items-center justify-center rounded-full border p-2.5'>
            <Upload className='size-6 text-muted-foreground' />
          </div>
          <p className='text-sm font-medium'>Drag & drop files here</p>
          <p className='text-xs text-muted-foreground'>Or click to browse</p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant='outline' size='sm' className='mt-2 w-fit'>
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map(file => (
          <FileUploadItem
            key={file.name}
            value={file}
            className={disabled ? "opacity-50" : ""}
          >
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete disabled={disabled} asChild>
              <Button variant='ghost' size='icon' className='size-7'>
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}

async function uploadFiles(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  return apiConn
    .post<string[]>("uploads", {
      body: formData
    })
    .json();
}

export function Scratch() {
  const form = useForm({
    defaultValues: {
      single: [],
      images: []
    },
    mode: "onBlur"
  });

  const onSubmit = async values => {
    // const images: File[] = values.images;
    // const urls = await uploadFiles(images);
    // console.log(urls);
    console.log(values);
  };

  return (
    <div className='pb-40'>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name='single'
            rules={{
              validate: images =>
                images.length > 0 || "Please upload at least one image"
            }}
            render={({ field, formState: { isSubmitting } }) => (
              <SimpleFormItem
                label='Single Image'
                desc='Upload your single images here'
                noControl
              >
                <SingleImageUpload
                  {...field}
                  disabled={isSubmitting || field.disabled}
                />
              </SimpleFormItem>
            )}
          />
          <FormField
            name='images'
            rules={{
              validate: images =>
                images.length > 0 || "Please upload at least one image"
            }}
            render={({ field, formState: { isSubmitting } }) => (
              <SimpleFormItem
                label='Images'
                desc='Upload your images here'
                noControl
              >
                <FileUploadBlock
                  {...field}
                  disabled={isSubmitting || field.disabled}
                />
              </SimpleFormItem>
            )}
          />
          <Button
            variant='default'
            className='mt-4'
            icon={HashIcon}
            effect='ringHover'
            type='submit'
            loading={form.formState.isSubmitting}
          >
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
}
