"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, ArrowLeft } from "lucide-react";
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

// Zod validation schema - same as NewLessonDialog but all optional for editing
const lessonEditSchema = z.object({
  title: z.string().min(1, "Lesson title is required").trim(),
  description: z.string().min(1, "Lesson description is required").trim(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export function EditLessonForm({ lesson, courseId, chapterId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(lessonEditSchema),
    defaultValues: {
      title: lesson.title || "",
      description: lesson.description || "",
      thumbnailKey: lesson.thumbnailKey || "",
      videoKey: lesson.videoKey || "",
    },
  });

  const updateLesson = async (lessonData) => {
    const response = await fetch(`${API_BASE_URL}/api/lesson/${lesson._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update lesson");
    }

    return response.json();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const updatePromise = async () => {
      const lessonData = {
        title: data.title,
        description: data.description,
        // Only include keys if they have values
        ...(data.thumbnailKey && { thumbnailKey: data.thumbnailKey }),
        ...(data.videoKey &&
          data.videoKey.trim() && { videoKey: data.videoKey.trim() }),
      };

      const result = await updateLesson(lessonData);

      // Redirect back to course structure
      router.push(`/admin/courses/${courseId}/edit?tab=course-structure`);

      return result;
    };

    toast.promise(updatePromise(), {
      loading: "Updating lesson...",
      success: "Lesson updated successfully!",
      error: (error) => `Failed to update lesson: ${error.message}`,
    });

    setIsLoading(false);
  };

  const handleCancel = () => {
    router.push(`/admin/courses/${courseId}/edit?tab=course-structure`);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={handleCancel} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Course Structure
      </Button>

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
                    rows={4}
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
                <FormLabel>Thumbnail Image</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onChange={field.onChange}
                    accept="image"
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-muted-foreground">
                  Upload a thumbnail image for this lesson
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

          {/* Current Files Info */}
          {(lesson.thumbnailKey || lesson.videoKey) && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-medium mb-2">Current Files:</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {lesson.thumbnailKey && (
                  <div>Thumbnail: {lesson.thumbnailKey}</div>
                )}
                {lesson.videoKey && <div>Video: {lesson.videoKey}</div>}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Lesson
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
