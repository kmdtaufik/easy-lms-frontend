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
  Clock,
  User,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // Check authentication
      const { data: session } = await authClient.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      setAuthLoading(false);

      // Fetch enrolled courses, latest courses, and user progress in parallel
      await Promise.all([
        fetchEnrolledCourses(session.user.id),
        fetchLatestCourses(),
        fetchUserProgress(),
      ]);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/login");
    }
  };

  const fetchEnrolledCourses = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/enrollment/user/${userId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const fetchLatestCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/product?limit=6`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setLatestCourses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching latest courses:", error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/lesson/progress/user/all`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData.message);
        throw new Error("Failed to fetch user progress");
        // Or handle the error as needed, e.g., set an error state
        // setError(errorData.message || "Failed to fetch user progress");
        //
      }
      const data = await response.json();
      setUserProgress(data.data || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "active":
        return <PlayCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <User className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              Continue your learning journey
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Enrolled Courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {userProgress.reduce(
                      (sum, item) => sum + item.progress.completedLessons,
                      0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completed Lessons
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <PlayCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {
                      enrolledCourses.filter(
                        (course) => course.status === "active"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Courses</h2>
          {enrolledCourses.length > 0 && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-40 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-2 w-full mb-2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No enrolled courses yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your learning journey by enrolling in a course below
              </p>
              <Button
                onClick={() =>
                  document
                    .getElementById("latest-courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProgress.slice(0, 6).map((item) => {
              const enrollment = item.enrollment;
              const progress = item.progress;

              return (
                <Card
                  key={enrollment._id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    {/* Course Image */}
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      {enrollment?.course?.fileKey ? (
                        <Image
                          src={`https://easy-lms.t3.storage.dev/${enrollment.course.fileKey}`}
                          alt={enrollment.course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-primary" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={`${getStatusColor(
                            enrollment.status
                          )} flex items-center gap-1`}
                        >
                          {getStatusIcon(enrollment.status)}
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {enrollment.course.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {enrollment.course.smallDescription}
                      </p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{progress.completionPercentage}%</span>
                        </div>
                        <Progress
                          value={progress.completionPercentage}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>
                            {progress.completedLessons} of{" "}
                            {progress.totalLessons} lessons
                          </span>
                          {progress.lastActivity && (
                            <span>
                              Last activity:{" "}
                              {new Date(
                                progress.lastActivity
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>
                          Enrolled{" "}
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </span>
                        {enrollment.status === "completed" &&
                          enrollment.completedAt && (
                            <span>
                              Completed{" "}
                              {new Date(
                                enrollment.completedAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/dashboard/${
                          enrollment.course.slug || enrollment.course._id
                        }`}
                      >
                        <Button
                          className="w-full"
                          variant={
                            enrollment.status === "completed"
                              ? "outline"
                              : "default"
                          }
                        >
                          {enrollment.status === "completed"
                            ? "Review Course"
                            : "Continue Learning"}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Latest Courses Section */}
      <section id="latest-courses">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Courses</h2>
          <Link href="/courses">
            <Button variant="outline" size="sm">
              View All Courses <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCourses.map((course) => {
              const isEnrolled = enrolledCourses.some(
                (enrollment) => enrollment.course._id === course._id
              );

              return (
                <Card
                  key={course._id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    {/* Course Image */}
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      {course.fileKey ? (
                        <Image
                          src={`https://easy-lms.t3.storage.dev/${course.fileKey}`}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-primary" />
                        </div>
                      )}

                      {/* Price Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/80 text-white">
                          ${course.price}
                        </Badge>
                      </div>

                      {/* Enrolled Badge */}
                      {isEnrolled && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{course.level}</Badge>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.smallDescription}
                      </p>

                      {/* Course Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{course.createdBy?.name}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link href={`/courses/${course.slug}`}>
                        <Button
                          className="w-full"
                          variant={isEnrolled ? "outline" : "default"}
                        >
                          {isEnrolled ? "View Course" : "Learn More"}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
