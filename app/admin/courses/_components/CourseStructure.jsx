"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Trash2,
  GripVertical,
  Plus,
  Loader2,
  Save,
} from "lucide-react";
import { FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // Assuming you're using sonner for notifications

// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiUtils = {
  async updateChapter(chapterId, data) {
    const response = await fetch(`${API_BASE_URL}/api/chapter/${chapterId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update chapter");
    return response.json();
  },

  async updateLesson(lessonId, data) {
    const response = await fetch(`${API_BASE_URL}/api/lesson/${lessonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update lesson");
    return response.json();
  },

  async deleteChapter(chapterId) {
    const response = await fetch(`${API_BASE_URL}/api/chapter/${chapterId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete chapter");
    return response.json();
  },

  async deleteLesson(lessonId) {
    const response = await fetch(`${API_BASE_URL}/api/lesson/${lessonId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete lesson");
    return response.json();
  },

  async createLesson(chapterId, data) {
    const response = await fetch(`${API_BASE_URL}/api/lesson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...data, chapterId }),
    });
    if (!response.ok) throw new Error("Failed to create lesson");
    return response.json();
  },

  async submitAllChanges(courseId, chaptersData) {
    const response = await fetch(`${API_BASE_URL}/api/course/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ chapters: chaptersData }),
    });
    if (!response.ok) throw new Error("Failed to submit changes");
    return response.json();
  },
};

export function CourseStructure({ course }) {
  console.log("course:", course);

  // Prepare chapters and lessons
  const initialChapters = course.chapters.map((chapter) => ({
    id: chapter._id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson._id,
      title: lesson.title,
      order: lesson.position,
    })),
  }));

  const [chapters, setChapters] = useState(initialChapters);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingItems, setDeletingItems] = useState(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle chapter open/close
  const toggleChapterOpen = useCallback((chapterId) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, isOpen: !ch.isOpen } : ch,
      ),
    );
  }, []);

  // Sortable Item Component
  function SortableItem({ children, itemId, className, type }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: itemId,
      data: { type },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "touch-none",
          className,
          isDragging ? "z-50 rotate-3 shadow-lg" : "",
        )}
      >
        {children(listeners)}
      </div>
    );
  }

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end
  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    const activeId = active.id;
    const overId = over.id;

    try {
      // Chapter reordering
      if (activeType === "chapter" && overType === "chapter") {
        const activeIndex = chapters.findIndex((ch) => ch.id === activeId);
        const overIndex = chapters.findIndex((ch) => ch.id === overId);

        const reorderedChapters = arrayMove(chapters, activeIndex, overIndex);
        setChapters(reorderedChapters);
        setHasUnsavedChanges(true);
        toast.success('Chapters reordered. Click "Save Changes" to confirm.');
      }
      // Lesson reordering within same chapter or moving between chapters
      else if (activeType === "lesson") {
        // Find the chapter containing the active lesson
        const activeChapterIndex = chapters.findIndex((ch) =>
          ch.lessons.some((lesson) => lesson.id === activeId),
        );
        const activeChapter = chapters[activeChapterIndex];
        const activeLessonIndex = activeChapter.lessons.findIndex(
          (lesson) => lesson.id === activeId,
        );
        const activeLesson = activeChapter.lessons[activeLessonIndex];

        // Find the target chapter
        let targetChapterIndex, targetChapter;
        if (overType === "lesson") {
          targetChapterIndex = chapters.findIndex((ch) =>
            ch.lessons.some((lesson) => lesson.id === overId),
          );
        } else if (overType === "chapter") {
          targetChapterIndex = chapters.findIndex((ch) => ch.id === overId);
        }

        targetChapter = chapters[targetChapterIndex];

        // Same chapter reordering
        if (
          activeChapterIndex === targetChapterIndex &&
          overType === "lesson"
        ) {
          const targetLessonIndex = targetChapter.lessons.findIndex(
            (lesson) => lesson.id === overId,
          );
          const reorderedLessons = arrayMove(
            targetChapter.lessons,
            activeLessonIndex,
            targetLessonIndex,
          );

          const updatedChapters = [...chapters];
          updatedChapters[targetChapterIndex] = {
            ...targetChapter,
            lessons: reorderedLessons,
          };
          setChapters(updatedChapters);
          setHasUnsavedChanges(true);
          toast.success('Lessons reordered. Click "Save Changes" to confirm.');
        }
        // Moving lesson to different chapter
        else if (activeChapterIndex !== targetChapterIndex) {
          // Remove from source chapter
          const updatedSourceLessons = activeChapter.lessons.filter(
            (lesson) => lesson.id !== activeId,
          );

          // Add to target chapter
          let newPosition = targetChapter.lessons.length;
          if (overType === "lesson") {
            const targetLessonIndex = targetChapter.lessons.findIndex(
              (lesson) => lesson.id === overId,
            );
            newPosition = targetLessonIndex;
          }

          const updatedTargetLessons = [...targetChapter.lessons];
          updatedTargetLessons.splice(newPosition, 0, activeLesson);

          const updatedChapters = [...chapters];
          updatedChapters[activeChapterIndex] = {
            ...activeChapter,
            lessons: updatedSourceLessons,
          };
          updatedChapters[targetChapterIndex] = {
            ...targetChapter,
            lessons: updatedTargetLessons,
          };
          setChapters(updatedChapters);
          setHasUnsavedChanges(true);
          toast.success('Lesson moved. Click "Save Changes" to confirm.');
        }
      }
    } catch (error) {
      console.error("Drag operation failed:", error);
      toast.error("Failed to update order. Please try again.");
    }
  }

  // Delete chapter
  const handleDeleteChapter = async (chapterId) => {
    if (
      !confirm(
        "Are you sure you want to delete this chapter? This will also delete all lessons in this chapter.",
      )
    ) {
      return;
    }

    setDeletingItems((prev) => new Set(prev).add(chapterId));

    try {
      await apiUtils.deleteChapter(chapterId);
      setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
      toast.success("Chapter deleted successfully");
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      toast.error("Failed to delete chapter. Please try again.");
    } finally {
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (chapterId, lessonId) => {
    if (!confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    setDeletingItems((prev) => new Set(prev).add(lessonId));

    try {
      await apiUtils.deleteLesson(lessonId);
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId
            ? {
                ...ch,
                lessons: ch.lessons.filter((lesson) => lesson.id !== lessonId),
              }
            : ch,
        ),
      );
      toast.success("Lesson deleted successfully");
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      toast.error("Failed to delete lesson. Please try again.");
    } finally {
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lessonId);
        return newSet;
      });
    }
  };

  // Create new lesson
  const handleCreateLesson = async (chapterId) => {
    setIsLoading(true);

    try {
      const newLesson = await apiUtils.createLesson(chapterId, {
        title: "New Lesson",
      });
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId
            ? {
                ...ch,
                lessons: [
                  ...ch.lessons,
                  {
                    id: newLesson._id || newLesson.id,
                    title: newLesson.title,
                    order: newLesson.position || ch.lessons.length + 1,
                  },
                ],
              }
            : ch,
        ),
      );
      toast.success("Lesson created successfully");
    } catch (error) {
      console.error("Failed to create lesson:", error);
      toast.error("Failed to create lesson. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit all changes
  const handleSubmitChanges = async () => {
    setIsSubmitting(true);
    const courseId = course._id || course.id;

    try {
      // Prepare chapters data with updated positions
      const chaptersData = chapters.map((chapter, chapterIndex) => ({
        id: chapter.id,
        position: chapterIndex + 1,
        lessons: chapter.lessons.map((lesson, lessonIndex) => ({
          id: lesson.id,
          position: lessonIndex + 1,
          chapterId: chapter.id,
        })),
      }));

      // Update each chapter's position
      for (const chapter of chaptersData) {
        await apiUtils.updateChapter(chapter.id, {
          position: chapter.position,
        });

        // Update each lesson's position and chapter assignment
        for (const lesson of chapter.lessons) {
          await apiUtils.updateLesson(lesson.id, {
            position: lesson.position,
            chapterId: lesson.chapterId,
          });
        }
      }

      setHasUnsavedChanges(false);
      toast.success("All changes saved successfully!");
    } catch (error) {
      if (process.env.NODE_ENV !== "production")
        console.error("Failed to save changes:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <div className="flex items-center gap-4">
            <CardTitle>Chapters</CardTitle>
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {hasUnsavedChanges && (
              <Button
                onClick={handleSubmitChanges}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <SortableContext
            items={chapters.map((ch) => ch.id)}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((chapter) => (
              <SortableItem
                key={chapter.id}
                itemId={chapter.id}
                type="chapter"
                className="mb-4"
              >
                {(chapterListeners) => (
                  <Card className="overflow-hidden">
                    <Collapsible
                      open={chapter.isOpen}
                      onOpenChange={() => toggleChapterOpen(chapter.id)}
                    >
                      {/* Chapter Header */}
                      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-grab active:cursor-grabbing"
                            {...chapterListeners}
                            disabled={isLoading}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon">
                              {chapter.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2 font-medium">
                            {chapter.title}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteChapter(chapter.id)}
                          disabled={deletingItems.has(chapter.id)}
                        >
                          {deletingItems.has(chapter.id) ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>

                      {/* Lessons */}
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={chapter.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {chapter.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                itemId={lesson.id}
                                type="lesson"
                                className="mb-1"
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-3 rounded-sm hover:bg-accent group">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100"
                                        {...lessonListeners}
                                        disabled={isLoading}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4 text-muted-foreground" />
                                      <Link
                                        href={`/admin/courses/${course._id || course.id}/${chapter.id}/${lesson.id}`}
                                        className="hover:text-primary transition-colors"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteLesson(
                                          chapter.id,
                                          lesson.id,
                                        )
                                      }
                                      disabled={deletingItems.has(lesson.id)}
                                      className="opacity-50 group-hover:opacity-100"
                                    >
                                      {deletingItems.has(lesson.id) ? (
                                        <Loader2 className="size-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="size-4" />
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2 border-t border-border mt-2">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => handleCreateLesson(chapter.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="size-4 animate-spin mr-2" />
                              ) : (
                                <Plus className="size-4 mr-2" />
                              )}
                              Create New Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
