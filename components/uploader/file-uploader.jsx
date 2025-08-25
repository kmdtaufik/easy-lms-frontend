"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./render-state";
import { toast } from "sonner";

export function FileUploader({ onChange, value }) {
  const [fileState, setFileState] = useState({
    error: false,
    file: "",
    id: "",
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    key: value,
  });

  //upload files
  async function uploadFile(file) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      //get presigned url
      const presignedRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/s3/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: true,
          }),
        },
      );

      if (!presignedRes.ok) {
        toast.error("Failed to get presigned url");
        setFileState((prev) => ({
          ...prev,
          error: true,
          uploading: false,
          progress: 0,
        }));
        return;
      }

      const { presignedUrl, key } = await presignedRes.json();
      //upload file to s3
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);

            setFileState((prev) => ({
              ...prev,
              progress: percentage,
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));
            //set value to field
            onChange?.(key);
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      //catch errors
    } catch (err) {
      toast.error("Upload failed. Something went wrong.");
      setFileState((prev) => ({
        ...prev,
        error: true,
        uploading: false,
        progress: 0,
      }));
      if (process.env.NODE_ENV !== "production") console.log(err);
    }
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (process.env.NODE_ENV !== "production") console.log(acceptedFiles);

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (fileState.objectURL && !fileState.objectURL.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectURL);
        }
        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectURL: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });

        uploadFile(file);
      }
    },
    [fileState.objectURL],
  );

  async function handleRemoveFile() {
    if (fileState.isDeleting || fileState.uploading) return;
    setFileState((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/s3/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key: fileState.key }),
        },
      );
      if (!res.ok) {
        toast.error("Failed to delete file from server");
        setFileState((prev) => ({ ...prev, isDeleting: false, error: true }));
        return;
      }
      toast.success("File deleted successfully");
      if (fileState.objectURL && !fileState.objectURL.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectURL);
      }
      //change field value
      onChange?.("");

      setFileState({
        error: false,
        file: "",
        id: "",
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
      });
    } catch (err) {
      toast.error("Failed to delete file. Something went wrong.");
      setFileState((prev) => ({ ...prev, isDeleting: false }));
      if (process.env.NODE_ENV !== "production") console.log(err);
    }
  }

  //rejeted files

  function onDropRejected(rejectedFiles) {
    if (rejectedFiles.length) {
      const tooManyFiles = rejectedFiles.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );
      const tooBigSize = rejectedFiles.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );
      if (tooBigSize) {
        toast.error("File is too large.");
      }
      if (tooManyFiles) {
        toast.error("Too many files selected.");
      }
    }
  }

  //cnotent render
  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file}
        />
      );
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectURL) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectURL}
          isDeleting={fileState.isDeleting}
          handleRemove={handleRemoveFile}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragActive}></RenderEmptyState>;
  }
  //clean up object url
  useEffect(() => {
    return () => {
      if (fileState.objectURL && !fileState.objectURL.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectURL);
      }
    };
  }, [fileState.objectURL]);
  //drop zone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, //5MB
    multiple: false,
    onDropRejected: onDropRejected,
    disabled:
      fileState.uploading || !!fileState.objectURL || fileState.isDeleting,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary  bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex  items-center justify-center w-full h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
