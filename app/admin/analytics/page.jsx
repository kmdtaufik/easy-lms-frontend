"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AnalyticsPage() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [lessonAnalytics, setLessonAnalytics] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Fetch all data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const [dashboardRes, quickRes, lessonsRes, coursesRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/stats/dashboard`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/stats/quick`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/lesson/progress/admin/analytics`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/product?limit=100`, {
            credentials: "include",
          }),
        ]);

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setDashboardStats(dashboardData.data);
      }

      if (quickRes.ok) {
        const quickData = await quickRes.json();
        setQuickStats(quickData.data);
      }

      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        setLessonAnalytics(lessonsData.data);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chapters when course is selected
  const fetchChapters = async (courseId) => {
    if (!courseId) {
      setChapters([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/chapter?courseId=${courseId}`,
        {
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        setChapters(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
    }
  };

  // Refresh analytics with filters
  const refreshLessonAnalytics = async () => {
    setRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedCourse) params.set("courseId", selectedCourse);
      if (selectedChapter) params.set("chapterId", selectedChapter);

      const res = await fetch(
        `${API_BASE_URL}/api/lesson/progress/admin/analytics?${params.toString()}`,
        { credentials: "include" }
      );

      if (res.ok) {
        const data = await res.json();
        setLessonAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to refresh lesson analytics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    fetchChapters(selectedCourse);
    setSelectedChapter(""); // Reset chapter selection when course changes
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse || selectedChapter) {
      refreshLessonAnalytics();
    }
  }, [selectedCourse, selectedChapter]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your learning platform
          </p>
        </div>
        <Button onClick={fetchAnalyticsData} disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Quick Stats Cards */}
      {quickStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold">
                    {quickStats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold">
                    {quickStats.totalCustomers.toLocaleString()}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold">
                    {quickStats.totalCourses.toLocaleString()}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    ${quickStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {dashboardStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Signups
                      </p>
                      <p className="text-2xl font-semibold">
                        {dashboardStats.users.totalSignups.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Customers
                      </p>
                      <p className="text-2xl font-semibold">
                        {dashboardStats.users.totalCustomers.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        New This Month
                      </p>
                      <p className="text-xl font-semibold text-green-600">
                        +{dashboardStats.users.newSignupsThisMonth}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        New Customers
                      </p>
                      <p className="text-xl font-semibold text-blue-600">
                        +{dashboardStats.users.newCustomersThisMonth}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Courses
                      </p>
                      <p className="text-2xl font-semibold">
                        {dashboardStats.courses.totalCourses}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p className="text-2xl font-semibold text-green-600">
                        {dashboardStats.courses.publishedCourses}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Draft</p>
                      <p className="text-xl font-semibold text-yellow-600">
                        {dashboardStats.courses.draftCourses}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Created This Month
                      </p>
                      <p className="text-xl font-semibold text-blue-600">
                        +{dashboardStats.courses.coursesCreatedThisMonth}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Content Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Chapters
                      </p>
                      <p className="text-2xl font-semibold">
                        {dashboardStats.content.totalChapters}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Lessons
                      </p>
                      <p className="text-2xl font-semibold">
                        {dashboardStats.content.totalLessons}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Published Lessons
                      </p>
                      <p className="text-xl font-semibold text-green-600">
                        {dashboardStats.content.lessonsInPublishedCourses}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Published Chapters
                      </p>
                      <p className="text-xl font-semibold text-green-600">
                        {dashboardStats.content.chaptersInPublishedCourses}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Revenue Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-semibold">
                        $
                        {dashboardStats.enrollments.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        This Month
                      </p>
                      <p className="text-2xl font-semibold text-green-600">
                        $
                        {dashboardStats.enrollments.revenueThisMonth.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Enrollments
                      </p>
                      <p className="text-xl font-semibold">
                        {dashboardStats.enrollments.totalEnrollments.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        This Month
                      </p>
                      <p className="text-xl font-semibold text-blue-600">
                        +{dashboardStats.enrollments.enrollmentsThisMonth}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          {dashboardStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrollment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Enrollment Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Enrollments</span>
                      <Badge className="bg-green-100 text-green-800">
                        {dashboardStats.enrollments.activeEnrollments}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {dashboardStats.enrollments.completedEnrollments}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {dashboardStats.enrollments.pendingEnrollments}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cancelled</span>
                      <Badge className="bg-red-100 text-red-800">
                        {dashboardStats.enrollments.cancelledEnrollments}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Average Progress</span>
                      <span className="text-sm font-semibold">
                        {dashboardStats.engagement.averageProgressPerUser.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={dashboardStats.engagement.averageProgressPerUser}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-semibold">
                        {dashboardStats.engagement.completionRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={dashboardStats.engagement.completionRate}
                    />
                  </div>

                  {dashboardStats.engagement.mostPopularCourse && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Most Popular Course
                      </p>
                      <p className="font-semibold">
                        {dashboardStats.engagement.mostPopularCourse.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {
                          dashboardStats.engagement.mostPopularCourse
                            .enrollmentCount
                        }{" "}
                        enrollments
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Lesson Analytics Tab */}
        <TabsContent value="lessons" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Lesson Analytics Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select
                    value={selectedChapter}
                    onValueChange={setSelectedChapter}
                    disabled={!selectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Chapters</SelectItem>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter._id} value={chapter._id}>
                          {chapter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={refreshLessonAnalytics} disabled={refreshing}>
                  {refreshing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Analytics Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Lesson Completion Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessonAnalytics && lessonAnalytics.length > 0 ? (
                <div className="space-y-4">
                  {lessonAnalytics.slice(0, 10).map((lesson) => (
                    <div
                      key={lesson.lessonId}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{lesson.lessonTitle}</h4>
                        <Badge
                          variant={
                            lesson.completionRate >= 70
                              ? "default"
                              : lesson.completionRate >= 40
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {lesson.completionRate}% completion
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                        <span>{lesson.completedCount} completed</span>
                        <span>{lesson.totalCount} total students</span>
                      </div>

                      <Progress value={lesson.completionRate} className="h-2" />
                    </div>
                  ))}

                  {lessonAnalytics.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing top 10 lessons. Total: {lessonAnalytics.length}{" "}
                      lessons
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {selectedCourse || selectedChapter
                      ? "No lesson data available for the selected filters"
                      : "No lesson analytics data available"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
