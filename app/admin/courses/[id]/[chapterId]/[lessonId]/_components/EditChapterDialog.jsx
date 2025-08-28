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
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function EditChapterDialog({ chapter, onChapterUpdated }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(chapter.title || "");

  const updateChapter = async (chapterData) => {
    const response = await fetch(`${API_BASE_URL}/api/chapter/${chapter.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(chapterData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update chapter");
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    if (!chapter.id) {
      toast.error("Chapter ID is required");
      return;
    }

    setIsLoading(true);

    const updatePromise = async () => {
      const chapterData = {
        title: title.trim(),
      };

      const result = await updateChapter(chapterData);

      // Close dialog
      setOpen(false);

      // Notify parent component
      if (onChapterUpdated) {
        onChapterUpdated(result);
      }

      return result;
    };

    toast.promise(updatePromise(), {
      loading: "Updating chapter...",
      success: "Chapter updated successfully!",
      error: (error) => `Failed to update chapter: ${error.message}`,
    });

    setIsLoading(false);
  };

  const handleCancel = () => {
    setTitle(chapter.title || ""); // Reset to original title
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setTitle(chapter.title || ""); // Reset title when dialog closes
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription>
            Update the chapter title. Changes will be saved automatically.
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
                  Updating...
                </>
              ) : (
                "Update Chapter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
