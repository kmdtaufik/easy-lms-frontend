import { CloudUploadIcon } from "lucide-react";
import { Button } from "../ui/button";
import { X, Upload, File, ImageIcon, FileText, Video } from "lucide-react"; // Added Video icon
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Progress } from "../ui/progress";

//Render Empty State
export function RenderEmptyState({ isDragActive, accept }) {
  // Added accept prop
  const isVideo = accept === "video";

  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your {isVideo ? "video" : "image"} files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button">Select {isVideo ? "video" : "image"} file</Button>
    </div>
  );
}

//Render Error State
export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold">Upload failed.</p>
      <p className="text-xs mt-1 text-muted-foreground">
        Something went wrong.
      </p>
      <Button type="button" className="mt-4">
        Retry Uploading
      </Button>
    </div>
  );
}

//Render upload state - FIXED: Added fileType prop and video preview support
export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemove,
  fileType,
}) {
  const isVideo = fileType === "video";

  return (
    <div className="relative w-full h-full">
      {isVideo ? (
        <video
          src={previewUrl}
          className="w-full h-full object-contain p-2"
          controls
        />
      ) : (
        <Image
          src={previewUrl}
          alt="uploaded file"
          fill
          className="object-contain p-2"
        />
      )}
      <Button
        type="button"
        variant={"destructive"}
        size={"icon"}
        onClick={handleRemove}
        disabled={isDeleting}
        className={cn("absolute top-4 right-4")}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

//render uploading state
export function RenderUploadingState({ progress, file }) {
  return (
    <div className="text-center flex justify-center items-center flex-col gap-4">
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        Uploading {file.name}
      </p>
      <Progress value={progress} className="w-[80%]" />
    </div>
  );
}
