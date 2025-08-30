"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";
import { PlayIcon } from "lucide-react";
import { LessonItem } from "./LessonItem";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function EnrolledCourseSidebar({ course }) {
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openChapters, setOpenChapters] = useState(
    new Set([course.chapters[0]?._id])
  );

  useEffect(() => {
    if (course?._id) {
      fetchCourseProgress();
    }
  }, [course._id]);

  const fetchCourseProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/lesson/progress/course/${course._id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourseProgress(data.data);
      } else {
        // If no progress found, set empty progress
        setCourseProgress({
          chapters: course.chapters.map((chapter) => ({
            chapter,
            lessons: chapter.lessons.map((lesson) => ({
              lesson,
              progress: { completed: false },
            })),
            stats: {
              totalLessons: chapter.lessons.length,
              completedLessons: 0,
              completionPercentage: 0,
            },
          })),
          stats: {
            totalLessons: course.chapters.reduce(
              (sum, ch) => sum + ch.lessons.length,
              0
            ),
            completedLessons: 0,
            completionPercentage: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
      // Fallback to empty progress
      setCourseProgress({
        chapters: course.chapters.map((chapter) => ({
          chapter,
          lessons: chapter.lessons.map((lesson) => ({
            lesson,
            progress: { completed: false },
          })),
          stats: {
            totalLessons: chapter.lessons.length,
            completedLessons: 0,
            completionPercentage: 0,
          },
        })),
        stats: {
          totalLessons: course.chapters.reduce(
            (sum, ch) => sum + ch.lessons.length,
            0
          ),
          completedLessons: 0,
          completionPercentage: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (chapterId) => {
    setOpenChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const getChapterProgress = (chapterId) => {
    if (!courseProgress) return { completed: 0, total: 0, percentage: 0 };

    const chapterData = courseProgress.chapters.find(
      (ch) => ch.chapter._id === chapterId
    );
    if (!chapterData) return { completed: 0, total: 0, percentage: 0 };

    return {
      completed: chapterData.stats.completedLessons,
      total: chapterData.stats.totalLessons,
      percentage: chapterData.stats.completionPercentage,
    };
  };

  const getLessonProgress = (lessonId) => {
    if (!courseProgress) return { completed: false };

    for (const chapterData of courseProgress.chapters) {
      const lessonData = chapterData.lessons.find(
        (l) => l.lesson._id === lessonId
      );
      if (lessonData) {
        return lessonData.progress;
      }
    }

    // Fallback to localStorage for immediate feedback
    const completedLessons = JSON.parse(
      localStorage.getItem("completedLessons") || "{}"
    );
    return { completed: !!completedLessons[lessonId] };
  };

  // Overall progress
  const overallProgress = courseProgress?.stats || {
    totalLessons: 0,
    completedLessons: 0,
    completionPercentage: 0,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Course Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <PlayIcon className="size-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {course.category} • {course.level}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>
              {loading
                ? "..."
                : `${overallProgress.completedLessons}/${overallProgress.totalLessons} Lessons`}
            </span>
          </div>
          <Progress
            value={loading ? 0 : overallProgress.completionPercentage}
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {loading
              ? "Loading..."
              : `${overallProgress.completionPercentage}% Complete`}
          </p>
        </div>
      </div>

      {/* Chapters & Lessons */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-4 pr-4 space-y-3">
          {course.chapters.map((chapter) => {
            const isOpen = openChapters.has(chapter._id);
            const chapterProgress = getChapterProgress(chapter._id);

            return (
              <Collapsible
                key={chapter._id}
                open={isOpen}
                onOpenChange={() => toggleChapter(chapter._id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full p-3 h-auto flex items-center gap-2 hover:bg-muted/50"
                  >
                    <div className="shrink-0">
                      {isOpen ? (
                        <ChevronDown className="size-4 text-primary" />
                      ) : (
                        <ChevronRight className="size-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate text-foreground">
                          {chapter.position}. {chapter.title}
                        </p>
                        {chapterProgress.total > 0 && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {chapterProgress.completed}/{chapterProgress.total}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {chapter.lessons.length} Lessons
                        </p>
                        {chapterProgress.total > 0 && (
                          <>
                            <span className="text-[10px] text-muted-foreground">
                              •
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {chapterProgress.percentage}% complete
                            </span>
                          </>
                        )}
                      </div>
                      {chapterProgress.total > 0 && (
                        <Progress
                          value={chapterProgress.percentage}
                          className="h-1 mt-2"
                        />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-3 pl-6 border-l-2 border-border space-y-2">
                  {chapter.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson._id}
                      lesson={lesson}
                      slug={course.slug}
                      progress={getLessonProgress(lesson._id)}
                      onProgressUpdate={fetchCourseProgress}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>

      {/* Course Info Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Total Duration</span>
            <span>{course.duration}h</span>
          </div>
          <div className="flex justify-between">
            <span>Instructor</span>
            <span className="truncate ml-2">{course.createdBy?.name}</span>
          </div>
          {overallProgress.totalLessons > 0 && (
            <div className="flex justify-between font-medium text-foreground">
              <span>Completion</span>
              <span>{overallProgress.completionPercentage}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
