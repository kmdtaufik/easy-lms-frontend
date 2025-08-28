"use client";

import { useState, useCallback } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { toast } from "sonner";
import { NewChapterDialog } from "./NewChapterDialog";
import NewLessonDialog from "./NewLessonDialog";
import { DeleteDialog } from "@/components/dialog/DeleleDialog";
import { EditChapterDialog } from "../[id]/[chapterId]/[lessonId]/_components/EditChapterDialog";

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
    if (!response.ok) {
      throw new Error("Failed to update chapter");
    }
    return response.json();
  },

  async updateLesson(lessonId, data) {
    const response = await fetch(`${API_BASE_URL}/api/lesson/${lessonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update lesson");
    }
    return response.json();
  },
};

export function CourseStructure({ course }) {
  // Prepare chapters and lessons - sort by position
  const initialChapters = course.chapters
    .sort((a, b) => a.position - b.position)
    .map((chapter) => ({
      id: chapter._id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons
        .sort((a, b) => a.position - b.position)
        .map((lesson) => ({
          id: lesson._id,
          title: lesson.title,
          order: lesson.position,
        })),
    }));

  const [chapters, setChapters] = useState(initialChapters);

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

  // Save changes function
  const saveChanges = async (updatedChapters, changeType) => {
    const savePromise = async () => {
      // Update each chapter's position
      for (const [chapterIndex, chapter] of updatedChapters.entries()) {
        await apiUtils.updateChapter(chapter.id, {
          position: chapterIndex + 1,
          course: course._id,
        });

        // Update each lesson's position and chapter assignment
        for (const [lessonIndex, lesson] of chapter.lessons.entries()) {
          await apiUtils.updateLesson(lesson.id, {
            position: lessonIndex + 1,
            chapter: chapter.id,
          });
        }
      }
    };

    toast.promise(savePromise(), {
      loading: `Saving ${changeType}...`,
      success: `${changeType} saved successfully! Refresh to see changes.`,
      error: `Failed to save ${changeType}. Please try again.`,
    });
  };

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

        // Save immediately
        await saveChanges(reorderedChapters, "chapter order");
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

          // Save immediately
          await saveChanges(updatedChapters, "lesson order");
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

          // Save immediately
          await saveChanges(updatedChapters, "lesson move");
        }
      }
    } catch (error) {
      console.error("Drag operation failed:", error);
      toast.error("Failed to update order. Please try again.");
    }
  }

  //handle delete chapter
  // async function handleDeleteChapter(chapterId) {}
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <div className="flex items-center gap-4 justify-between w-full ">
            <CardTitle>Chapters</CardTitle>
            <NewChapterDialog
              courseId={course._id}
              onChapterCreated={(newChapter) => {
                // Refresh course data or update local state
                if (process.env.NODE_ENV !== "production")
                  console.log("New chapter created:", newChapter);
                window.location.reload();
              }}
            />
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
                          {/* Edit Chapter Button */}
                          <EditChapterDialog
                            chapter={chapter}
                            onChapterUpdated={(updatedChapter) => {
                              // Update the chapter title in local state
                              setChapters((prev) =>
                                prev.map((ch) =>
                                  ch.id === chapter.id
                                    ? {
                                        ...ch,
                                        title: updatedChapter.data.title,
                                      }
                                    : ch,
                                ),
                              );
                            }}
                          />
                        </div>
                        <DeleteDialog
                          type="chapter"
                          id={chapter.id}
                          onDelete={(deletedId, type) => {
                            // Remove chapter from local state
                            setChapters((prev) =>
                              prev.filter((ch) => ch.id !== deletedId),
                            );
                          }}
                        />
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
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4 text-muted-foreground" />
                                      <Link
                                        href={`/admin/courses/${
                                          course._id || course.id
                                        }/${chapter.id}/${lesson.id}`}
                                        className="hover:text-primary transition-colors"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    {/*Delete Button */}
                                    <DeleteDialog
                                      type="lesson"
                                      id={lesson.id}
                                      onDelete={(deletedId, type) => {
                                        // Remove lesson from chapter's lessons array
                                        setChapters((prev) =>
                                          prev.map((ch) => ({
                                            ...ch,
                                            lessons: ch.lessons.filter(
                                              (lesson) =>
                                                lesson.id !== deletedId,
                                            ),
                                          })),
                                        );
                                      }}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    <NewLessonDialog
                      chapterId={chapter.id}
                      onLessonCreated={(newLesson) => {
                        // Update local state to add the new lesson
                        if (process.env.NODE_ENV !== "production")
                          console.log("New lesson created:", newLesson);
                        window.location.reload();
                      }}
                    />
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
