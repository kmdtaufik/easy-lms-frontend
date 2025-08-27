"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/uploader/file-uploader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Zod validation schema - thumbnailKey required, videoKey optional
const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required").trim(),
  description: z.string().min(1, "Lesson description is required").trim(),
  thumbnailKey: z.string().min(1, "Thumbnail is required"),
  videoKey: z.string().optional(),
});

export function NewLessonDialog({ chapterId, onLessonCreated }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailKey: "",
      videoKey: "",
    },
  });

  const createLesson = async (lessonData) => {
    const response = await fetch(`${API_BASE_URL}/api/lesson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create lesson");
    }

    return response.json();
  };

  const onSubmit = async (data) => {
    if (!chapterId) {
      toast.error("Chapter ID is required");
      return;
    }

    setIsLoading(true);

    const createPromise = async () => {
      const lessonData = {
        title: data.title,
        description: data.description,
        thumbnailKey: data.thumbnailKey,
        chapterId: chapterId,
        // Only include videoKey if it has a value
        ...(data.videoKey &&
          data.videoKey.trim() && { videoKey: data.videoKey.trim() }),
      };

      const result = await createLesson(lessonData);

      // Reset form and close dialog
      form.reset();
      setOpen(false);

      // Notify parent component
      if (onLessonCreated) {
        onLessonCreated(result);
      }

      return result;
    };

    toast.promise(createPromise(), {
      loading: "Creating lesson...",
      success: "Lesson created successfully!",
      error: (error) => `Failed to create lesson: ${error.message}`,
    });

    setIsLoading(false);
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Create New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            Add a new lesson to this chapter. Upload thumbnail and video files,
            then fill in the details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter lesson title..."
                      disabled={isLoading}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter lesson description..."
                      disabled={isLoading}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnailKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image *</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Upload a thumbnail image for this lesson (required)
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                      accept="video"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Upload a video file for this lesson (optional)
                  </p>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Lesson"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewLessonDialog;
