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
import { Upload, X } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

function FileUploadBlock({
  value,
  onChange
}: {
  value?: File[];
  onChange?: (files: File[]) => void;
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

  const onUpload = React.useCallback(
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
  );

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onFileReject={onFileReject}
      onUpload={onUpload}
      accept='image/*'
      maxFiles={2}
      className='w-full'
      maxSize={2 * 1024 * 1024 /* 2MB */}
      multiple
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
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
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

export function Scratch() {
  const form = useForm({
    defaultValues: {
      images: []
    },
    mode: "onBlur"
  });

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <div className='pb-40'>
      <p>{form.getValues("images").length}</p>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name='images'
            rules={{
              validate: images =>
                images.length > 0 || "Please upload at least one image"
            }}
            render={({ field }) => (
              <SimpleFormItem
                label='Images'
                desc='Upload your images here'
                noControl
              >
                <FileUploadBlock
                  value={field.value}
                  onChange={field.onChange}
                />
              </SimpleFormItem>
            )}
          />
          <Button className='mt-4' effect='gooeyRight' type='submit'>
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
}
