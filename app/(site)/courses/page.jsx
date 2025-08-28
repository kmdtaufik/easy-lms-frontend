import { PublicCourseCard } from "../_components/CourseCard";
import EmptyState from "@/components/genral/EmptyState";
import { Suspense } from "react";
import CSSLoader from "@/components/loader/loader";

export default async function PublicCoursePage({ searchParams }) {
  // Await searchParams before using its properties
  const params = await searchParams;

  // Fetch courses
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Add cache for better performance on public pages
    // next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const body = await res.json();
  const courses = body.data;
  const pagination = body.pagination;

  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Explore Courses</h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals
        </p>
      </div>

      {courses && courses.length > 0 ? (
        <>
          <Suspense fallback={<CSSLoader variant="default" size="md" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <PublicCourseCard key={course.id} course={course} />
              ))}
            </div>
          </Suspense>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <EmptyState />
        </div>
      )}
    </div>
  );
}
