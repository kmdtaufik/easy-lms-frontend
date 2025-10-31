"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Clock,
  User,
  FileText,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCourseProgress } from "@/hooks/use-course-progress";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CourseDashboardPage({ params }) {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState(null);

  // Extract params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  // Fetch course progress using our custom hook
  const { progress: courseProgress, loading: progressLoading } =
    useCourseProgress(course?._id);

  useEffect(() => {
    if (slug) {
      fetchCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course by slug
      const response = await fetch(`${API_BASE_URL}/api/product/slug/${slug}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Course not found");
      }

      const data = await response.json();
      setCourse(data.data);
    } catch (err) {
      console.error("Error fetching course:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLessonCompletionStatus = (lessonId) => {
    const completedLessons = JSON.parse(
      localStorage.getItem("completedLessons") || "{}"
    );
    return !!completedLessons[lessonId];
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The course you're looking for doesn't exist."}
            </p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallProgress = courseProgress?.stats.completionPercentage || 0;
  const completedLessons = courseProgress?.stats.completedLessons || 0;
  const totalLessons = courseProgress?.stats.totalLessons || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {course.fileKey ? (
                <Image
                  src={`https://easy-lms.t3.storage.dev/${course.fileKey}`}
                  alt={course.title}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-48 h-36 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">
                {course.smallDescription}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">{course.level}</Badge>
                <Badge variant="outline">{course.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}h</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{course.createdBy?.name}</span>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Course Progress</span>
                  <span>{overallProgress}% Complete</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.chapters?.map((chapter, chapterIndex) => {
                  const chapterProgress = getChapterProgress(chapter._id);

                  return (
                    <div key={chapter._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </h3>
                        <Badge variant="outline">
                          {chapterProgress.completed}/{chapterProgress.total}{" "}
                          completed
                        </Badge>
                      </div>

                      {chapterProgress.total > 0 && (
                        <div className="mb-4">
                          <Progress
                            value={chapterProgress.percentage}
                            className="h-1.5"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {chapter.lessons?.map((lesson, lessonIndex) => {
                          const isCompleted = getLessonCompletionStatus(
                            lesson._id
                          );

                          return (
                            <Link
                              key={lesson._id}
                              href={`/dashboard/${slug}/${lesson._id}`}
                              className="block"
                            >
                              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <PlayCircle className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  {lesson.description && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>

                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {overallProgress}%
                  </div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Lessons</span>
                    <span>{totalLessons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="text-green-600">{completedLessons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining</span>
                    <span className="text-orange-600">
                      {totalLessons - completedLessons}
                    </span>
                  </div>
                </div>

                {courseProgress && courseProgress.chapters.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-3">
                      Chapter Progress
                    </h4>
                    <div className="space-y-2">
                      {courseProgress.chapters.map((chapterData, index) => (
                        <div key={chapterData.chapter._id} className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="truncate">
                              Ch {index + 1}: {chapterData.chapter.title}
                            </span>
                            <span>
                              {chapterData.stats.completionPercentage}%
                            </span>
                          </div>
                          <Progress
                            value={chapterData.stats.completionPercentage}
                            className="h-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Instructor: {course.createdBy?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {course.duration} hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Level: {course.level}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Category: {course.category}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
