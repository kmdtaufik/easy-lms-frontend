import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function DeleteDialog({
  children,
  type,
  id,
  onDelete,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = {
    chapter: handleChapterDelete,
    lesson: handleLessonDelete,
    course: handleCourseDelete,
  }[type];

  // Delete handlers
  async function handleChapterDelete() {
    if (!id) {
      toast.error("Chapter ID is required");
      return;
    }

    setIsDeleting(true);

    const deletePromise = async () => {
      const response = await fetch(`${API_BASE_URL}/api/chapter/${id}`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete chapter");
      }

      const result = await response.json();

      // Close dialog and notify parent
      setOpen(false);
      if (onDelete) {
        onDelete(id, "chapter");
      }

      return result;
    };

    toast.promise(deletePromise(), {
      loading: "Deleting chapter...",
      success: "Chapter and its lessons deleted successfully!",
      error: (error) => `Failed to delete chapter: ${error.message}`,
    });

    setIsDeleting(false);
  }

  async function handleLessonDelete() {
    if (!id) {
      toast.error("Lesson ID is required");
      return;
    }

    setIsDeleting(true);

    const deletePromise = async () => {
      const response = await fetch(`${API_BASE_URL}/api/lesson/${id}`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete lesson");
      }

      const result = await response.json();

      // Close dialog and notify parent
      setOpen(false);
      if (onDelete) {
        onDelete(id, "lesson");
      }

      return result;
    };

    toast.promise(deletePromise(), {
      loading: "Deleting lesson...",
      success: "Lesson deleted successfully!",
      error: (error) => `Failed to delete lesson: ${error.message}`,
    });

    setIsDeleting(false);
  }

  async function handleCourseDelete() {
    if (!id) {
      toast.error("Course ID is required");
      return;
    }

    setIsDeleting(true);

    const deletePromise = async () => {
      const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      const result = await response.json();

      // Close dialog and notify parent
      setOpen(false);
      if (onDelete) {
        onDelete(id, "course");
      }

      return result;
    };

    toast.promise(deletePromise(), {
      loading: "Deleting course...",
      success: "Course and all related content deleted successfully!",
      error: (error) => `Failed to delete course: ${error.message}`,
    });

    setIsDeleting(false);
  }

  const getItemName = () => {
    switch (type) {
      case "chapter":
        return "chapter";
      case "lesson":
        return "lesson";
      case "course":
        return "course";
      default:
        return "item";
    }
  };

  const getWarningMessage = () => {
    switch (type) {
      case "chapter":
        return "This will permanently delete the chapter and all its lessons. This action cannot be undone.";
      case "lesson":
        return "This will permanently delete the lesson. This action cannot be undone.";
      case "course":
        return "This will permanently delete the entire course, including all chapters and lessons. This action cannot be undone.";
      default:
        return "This action cannot be undone.";
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={children ? "ghost" : "outline"}
          size={!children ? "icon" : "default"}
          disabled={disabled || isDeleting}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="size-4" />
              {children}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you you want to delete {getItemName()}?
          </AlertDialogTitle>
          <AlertDialogDescription className=" text-destructive">
            {getWarningMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
