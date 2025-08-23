"use client";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Upload, File, ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileUploader({
  value = [],
  onChange,
  onFilesChange,
  maxFiles = 1,

  // 10MB default
  maxSize = 5 * 1024 * 1024,

  acceptedFileTypes = ["image/*"],
  className,
}) {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (value && value.length !== files.length) {
      const filesWithPreview = value.map((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        });
        return fileWithPreview;
      });
      setFiles(filesWithPreview);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        });
        return fileWithPreview;
      });

      setFiles((prev) => {
        const updated = [...prev, ...newFiles].slice(0, maxFiles);
        onChange?.(updated);
        onFilesChange?.(updated);
        return updated;
      });

      newFiles.forEach((file) => {
        simulateUpload(file.name);
      });
    },
    [maxFiles, onChange, onFilesChange],
  );

  const simulateUpload = (fileName) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress((prev) => ({ ...prev, [fileName]: progress }));
    }, 200);
  };

  const removeFile = (fileName) => {
    setFiles((prev) => {
      const updated = prev.filter((file) => file.name !== fileName);
      onChange?.(updated);
      onFilesChange?.(updated);
      return updated;
    });
    setUploadProgress((prev) => {
      const { [fileName]: removed, ...rest } = prev;
      return rest;
    });
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      maxFiles,
      maxSize,
      accept: acceptedFileTypes.reduce((acc, type) => {
        acc[type] = [];
        return acc;
      }, {}),
    });

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="h-4 w-4" />;
    if (file.type.includes("pdf")) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive &&
            "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "rounded-full p-4",
              isDragActive && !isDragReject && "bg-primary/10",
              isDragReject && "bg-destructive/10",
              !isDragActive && "bg-muted/50",
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8",
                isDragActive && !isDragReject && "text-primary",
                isDragReject && "text-destructive",
                !isDragActive && "text-muted-foreground",
              )}
            />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive
                ? isDragReject
                  ? "Some files are not supported"
                  : "Drop files here"
                : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </div>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.name} className="p-3">
                <div className="flex items-center gap-3">
                  {file.preview ? (
                    <img
                      src={file.preview || "/placeholder.svg"}
                      alt={file.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                      {getFileIcon(file)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>

                    {uploadProgress[file.name] !== undefined &&
                      uploadProgress[file.name] < 100 && (
                        <div className="mt-1">
                          <Progress
                            value={uploadProgress[file.name]}
                            className="h-1"
                          />
                        </div>
                      )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
