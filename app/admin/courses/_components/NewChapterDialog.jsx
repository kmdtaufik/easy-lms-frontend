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
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function NewChapterDialog({ courseId, onChapterCreated }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const createChapter = async (chapterData) => {
    const response = await fetch(`${API_BASE_URL}/api/chapter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(chapterData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create chapter");
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    if (!courseId) {
      toast.error("Course ID is required");
      return;
    }

    setIsLoading(true);

    const createPromise = async () => {
      const chapterData = {
        title: title.trim(),
        courseId: courseId,
      };

      const result = await createChapter(chapterData);

      // Reset form and close dialog
      setTitle("");
      setOpen(false);

      // Notify parent component
      if (onChapterCreated) {
        onChapterCreated(result);
      }

      return result;
    };

    toast.promise(createPromise(), {
      loading: "Creating chapter...",
      success: "Chapter created successfully!",
      error: (error) => `Failed to create chapter: ${error.message}`,
    });

    setIsLoading(false);
  };

  const handleCancel = () => {
    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            Add a new chapter to your course. The chapter will be positioned
            automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Chapter Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chapter title..."
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

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
                "Create Chapter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
