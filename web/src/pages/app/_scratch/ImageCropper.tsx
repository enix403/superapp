import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileWithPath, useDropzone } from "react-dropzone";

import { FileWithPreview, ImageCropper } from '@/components/ui/image-cropper';

const accept = {
  "image/*": []
};

export function CropperView() {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        alert("Selected image is too large!");
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });

      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept
  });

  return (
    <div className='relative'>
      {selectedFile ? (
        <ImageCropper
          dialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      ) : (
        <Avatar
          {...getRootProps()}
          className='size-36 cursor-pointer ring-2 ring-slate-200 ring-offset-2'
        >
          <input {...getInputProps()} />
          {/* <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' /> */}
          <AvatarFallback className='text-center'>
            Drop/Click <br />
            to upload
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
