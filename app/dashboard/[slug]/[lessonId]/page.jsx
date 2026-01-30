"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  PlayCircle,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LessonPage({ params }) {
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [course, setCourse] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [markingProgress, setMarkingProgress] = useState(false);
  const [slug, setSlug] = useState(null);
  const [lessonId, setLessonId] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(null);

  // Extract params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
      setLessonId(resolvedParams.lessonId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (slug && lessonId) {
      fetchLessonData();
      fetchLessonProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);

      // Fetch lesson details
      const lessonResponse = await fetch(
        `${API_BASE_URL}/api/lesson/${lessonId}`,
        {
          credentials: "include",
        }
      );

      if (!lessonResponse.ok) {
        throw new Error("Lesson not found");
      }

      const lessonData = await lessonResponse.json();
      setLesson(lessonData);

      // Fetch chapter details
      if (lessonData.chapter) {
        const chapterResponse = await fetch(
          `${API_BASE_URL}/api/chapter/${lessonData.chapter}`,
          {
            credentials: "include",
          }
        );

        if (chapterResponse.ok) {
          const chapterData = await chapterResponse.json();
          setChapter(chapterData);

          // Fetch all lessons in this chapter for navigation
          const allLessonsResponse = await fetch(
            `${API_BASE_URL}/api/lesson?chapterId=${lessonData.chapter}`,
            {
              credentials: "include",
            }
          );

          if (allLessonsResponse.ok) {
            const allLessonsData = await allLessonsResponse.json();
            setAllLessons(allLessonsData);
          }

          // Fetch course details
          if (chapterData.course) {
            const courseResponse = await fetch(
              `${API_BASE_URL}/api/product/${chapterData.course}`,
              {
                credentials: "include",
              }
            );

            if (courseResponse.ok) {
              const courseData = await courseResponse.json();
              setCourse(courseData.data);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetching lesson data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonProgress = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/lesson/progress/${lessonId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const progressData = await response.json();
        setLessonProgress(progressData.data);
        setIsCompleted(progressData.data?.completed || false);
      } else {
        // No progress found - lesson not started
        setIsCompleted(false);
        setLessonProgress(null);
      }
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      setIsCompleted(false);
    }
  };

  const markAsCompleted = async () => {
    try {
      setMarkingProgress(true);

      const response = await fetch(
        `${API_BASE_URL}/api/lesson/progress/${lessonId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ completed: true }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error marking lesson as completed:", errorData.message);
      }

      if (response.ok) {
        const progressData = await response.json();
        setLessonProgress(progressData.data);
        setIsCompleted(true);

        // Also update localStorage for immediate UI feedback
        const completedLessons = JSON.parse(
          localStorage.getItem("completedLessons") || "{}"
        );
        completedLessons[lessonId] = {
          completedAt: new Date().toISOString(),
          lessonTitle: lesson.title,
          chapterId: lesson.chapter,
        };
        localStorage.setItem(
          "completedLessons",
          JSON.stringify(completedLessons)
        );

        toast.success("Lesson marked as completed!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to mark lesson as completed");
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      toast.error("Failed to mark lesson as completed");
    } finally {
      setMarkingProgress(false);
    }
  };

  const markAsIncomplete = async () => {
    try {
      setMarkingProgress(true);

      const response = await fetch(
        `${API_BASE_URL}/api/lesson/progress/${lessonId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ completed: false }),
        }
      );

      if (response.ok) {
        const progressData = await response.json();
        setLessonProgress(progressData.data);
        setIsCompleted(false);

        // Also update localStorage
        const completedLessons = JSON.parse(
          localStorage.getItem("completedLessons") || "{}"
        );
        delete completedLessons[lessonId];
        localStorage.setItem(
          "completedLessons",
          JSON.stringify(completedLessons)
        );

        toast.success("Lesson marked as incomplete");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to mark lesson as incomplete");
      }
    } catch (error) {
      console.error("Error marking lesson as incomplete:", error);
      toast.error("Failed to mark lesson as incomplete");
    } finally {
      setMarkingProgress(false);
    }
  };

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex((l) => l._id === lessonId);
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;
  };

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const getLessonCompletionStatus = (lessonIdToCheck) => {
    // Check localStorage first for immediate feedback
    const completedLessons = JSON.parse(
      localStorage.getItem("completedLessons") || "{}"
    );
    return !!completedLessons[lessonIdToCheck];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-8 w-64" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Skeleton className="aspect-video w-full rounded-lg mb-6" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Lesson Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The lesson you're looking for doesn't exist."}
            </p>
            {/* <Link href={`/dashboard/${slug}`}>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* <Link href={`/dashboard/${slug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link> */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                {course?.title && (
                  <>
                    <span>{course.title}</span>
                    <span>•</span>
                  </>
                )}
                {chapter?.title && <span>{chapter.title}</span>}
              </div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={isCompleted ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3" />
                    In Progress
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-3">
            {/* Video/Thumbnail Section */}
            <div className="mb-8">
              {lesson.videoKey ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster={
                      lesson.thumbnailKey
                        ? `https://easy-lms.t3.storage.dev/${lesson.thumbnailKey}`
                        : undefined
                    }
                  >
                    <source
                      src={`https://easy-lms.t3.storage.dev/${lesson.videoKey}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : lesson.thumbnailKey ? (
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={`https://easy-lms.t3.storage.dev/${lesson.thumbnailKey}`}
                    alt={lesson.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white/80" />
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-primary" />
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
                {lesson.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {lesson.description}
                  </p>
                )}
              </div>

              {/* Completion Actions */}
              <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">
                    {isCompleted ? "Lesson Completed!" : "Mark as Complete"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isCompleted
                      ? "You've completed this lesson. Great job!"
                      : "Mark this lesson as completed when you're done."}
                  </p>
                  {lessonProgress && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {isCompleted
                        ? `Completed on ${new Date(
                            lessonProgress.updatedAt
                          ).toLocaleDateString()}`
                        : `Started on ${new Date(
                            lessonProgress.createdAt
                          ).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {isCompleted ? (
                    <Button
                      variant="outline"
                      disabled={true}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {markingProgress ? "Updating..." : " Completed"}
                    </Button>
                  ) : (
                    <Button
                      onClick={markAsCompleted}
                      disabled={markingProgress}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {markingProgress ? "Marking..." : "Mark Complete"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  {previousLesson && (
                    <Link href={`/dashboard/${slug}/${previousLesson._id}`}>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous: {previousLesson.title}
                      </Button>
                    </Link>
                  )}
                </div>
                <div>
                  {nextLesson && (
                    <Link href={`/dashboard/${slug}/${nextLesson._id}`}>
                      <Button className="flex items-center gap-2">
                        Next: {nextLesson.title}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Chapter Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {allLessons.length > 0 && (
                  <>
                    <div className="text-sm text-muted-foreground mb-4">
                      Lesson {getCurrentLessonIndex() + 1} of{" "}
                      {allLessons.length}
                    </div>

                    <div className="space-y-2">
                      {allLessons.map((l, index) => {
                        const isCurrentLesson = l._id === lessonId;
                        const isLessonCompleted = getLessonCompletionStatus(
                          l._id
                        );

                        return (
                          <Link
                            key={l._id}
                            href={`/dashboard/${slug}/${l._id}`}
                          >
                            <div
                              className={`
                              p-3 rounded-lg border cursor-pointer transition-colors
                              ${
                                isCurrentLesson
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : isLessonCompleted
                                  ? "bg-green-50 border-green-200 hover:bg-green-100"
                                  : "hover:bg-muted"
                              }
                            `}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0">
                                  {isLessonCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : isCurrentLesson ? (
                                    <PlayCircle className="h-4 w-4" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium truncate ${
                                      isCurrentLesson
                                        ? "text-primary-foreground"
                                        : ""
                                    }`}
                                  >
                                    {index + 1}. {l.title}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Course Info */}
                {course && (
                  <div className="pt-4 border-t space-y-2">
                    <h4 className="font-medium text-sm">Course Details</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{course.createdBy?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}h total</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>{course.level}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
