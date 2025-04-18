"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Pencil, X, Loader2 } from "lucide-react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface AvatarChangerProps {
  initialImageSrc?: string;
  onSave?: (imageData: string | null) => Promise<void> | void;
}

export function AvatarChanger({ initialImageSrc, onSave }: AvatarChangerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(
    initialImageSrc || null
  );
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarSrc(initialImageSrc || null);
  }, [initialImageSrc]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  }, []);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = event => {
      const imageDataUrl = event.target?.result as string;
      setOriginalSrc(imageDataUrl);
      setIsCropping(true);
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // Create a centered crop with aspect ratio 1:1
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90
          },
          1, // aspect ratio
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
      setCompletedCrop(crop);
    },
    []
  );

  const getCroppedImg = useCallback(() => {
    if (!imgRef.current || !completedCrop) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return canvas.toDataURL("image/jpeg");
  }, [completedCrop]);

  const handleCropComplete = useCallback((crop: Crop) => {
    setCompletedCrop(crop);
  }, []);

  const handleCropCancel = () => {
    setIsCropping(false);
    setOriginalSrc(null);
  };

  const handleCropConfirm = () => {
    const croppedImageUrl = getCroppedImg();
    if (croppedImageUrl) {
      setPreviewSrc(croppedImageUrl);
      setIsCropping(false);
      setOriginalSrc(null);
    }
  };

  const applyImage = async (image: string | null) => {
    try {
      setIsLoading(true);
      if (onSave) {
        await onSave(image);
      }
      setAvatarSrc(image);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    applyImage(previewSrc);
  };

  const handleRemove = () => {
    applyImage(null);
  };

  const openDialog = () => {
    setPreviewSrc(avatarSrc);
    setIsDialogOpen(true);
  };

  return (
    <div className='w-fit cursor-pointer'>
      <div
        className='relative'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className='h-24 w-24 border'>
          <AvatarImage src={avatarSrc || undefined} />
          <AvatarFallback className='text-lg'>
            {avatarSrc ? "" : "N/A"}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          onClick={openDialog}
        >
          <div className='flex cursor-pointer flex-col items-center'>
            <Pencil className='h-5 w-5' />
            <span className='text-xs'>Edit</span>
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          if (!isLoading) {
            setIsDialogOpen(open);
            if (!open) {
              setIsCropping(false);
              setOriginalSrc(null);
            }
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit profile picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture or remove your current one.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='mt-2 text-sm text-muted-foreground'>
                Processing image...
              </p>
            </div>
          ) : isCropping && originalSrc ? (
            <div className='grid gap-6 py-4'>
              <div className='flex flex-col items-center'>
                <div className='max-h-[300px] overflow-hidden'>
                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={handleCropComplete}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      src={originalSrc || "/placeholder.svg"}
                      alt='Crop preview'
                      onLoad={onImageLoad}
                      className='max-h-[300px] w-auto'
                    />
                  </ReactCrop>
                </div>
                <div className='mt-4 flex gap-2'>
                  <Button variant='outline' onClick={handleCropCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleCropConfirm}>Apply Crop</Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn("grid gap-6 py-4", isDragging && "opacity-70")}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-6 transition-colors",
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25"
                )}
              >
                {previewSrc ? (
                  <div className='relative h-40 w-40'>
                    <img
                      src={previewSrc || "/placeholder.svg"}
                      alt='Profile preview'
                      className='h-full w-full rounded-full object-cover'
                    />
                    <Button
                      variant='destructive'
                      size='icon'
                      className='absolute -top-2 -right-2 h-8 w-8 rounded-full'
                      onClick={handleRemove}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ) : (
                  <div className='flex h-40 w-40 items-center justify-center rounded-full bg-muted'>
                    <p className='text-center text-sm text-muted-foreground'>
                      {isDragging
                        ? "Drop image here"
                        : "Drag image here or click to browse"}
                    </p>
                  </div>
                )}

                <div className='grid w-full gap-2'>
                  <label
                    htmlFor='picture'
                    className='cursor-pointer rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90'
                  >
                    Choose file
                  </label>
                  <input
                    id='picture'
                    type='file'
                    accept='image/*'
                    className='sr-only'
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <p className='text-center text-xs text-muted-foreground'>
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isCropping && !isLoading && (
            <DialogFooter className='flex flex-row items-center justify-between sm:justify-between'>
              <div>
                {avatarSrc && (
                  <Button
                    variant='outline'
                    onClick={handleRemove}
                    className='text-destructive hover:text-destructive'
                    disabled={!previewSrc}
                  >
                    Remove Picture
                  </Button>
                )}
              </div>
              <Button onClick={handleSave} disabled={!previewSrc || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
              {/* </div> */}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
