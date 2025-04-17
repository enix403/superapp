"use client";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview, FileUploadList,
  FileUploadTrigger
} from "@/components/ui/file-upload";
import { useMaybeControlled } from "@/hooks/useMaybeControlled";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function GenericUpload({
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
