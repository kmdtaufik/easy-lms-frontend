import { CloudUploadIcon } from "lucide-react";
import { Button } from "../ui/button";
import { X, Upload, File, ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Progress } from "../ui/progress";
//Render Empty State
export function RenderEmptyState({ isDragActive }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary",
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button">Select file(s)</Button>
    </div>
  );
}

//Render Error State
export function RenderErrorState() {
  return (
    <div className=" text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold ">Upload failed.</p>
      <p className="text-xs mt-1 text-muted-foreground">
        Something Went wrong.
      </p>
      <Button type="button" className="mt-4">
        Retry Uploading
      </Button>
    </div>
  );
}

//Render upload state
export function RenderUploadedState({ previewUrl, isDeleting, handleRemove }) {
  return (
    <div>
      <Image
        src={previewUrl}
        alt="uploaded file"
        fill
        className="object-contain p-2 "
      />
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
