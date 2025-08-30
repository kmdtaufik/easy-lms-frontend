import { PublicCourseCard } from "../_components/CourseCard";
import EmptyState from "@/components/genral/EmptyState";
import { Suspense } from "react";
import CSSLoader from "@/components/loader/loader";
import { CourseSearch } from "../_components/CourseSearch";
import { Badge } from "@/components/ui/badge";

// Add this before the default export
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params.search;

  if (searchQuery) {
    return {
      title: `Search: ${searchQuery} | Easy LMS Courses`,
      description: `Search results for "${searchQuery}" in our course catalog.`,
    };
  }

  return {
    title: "Courses | Easy LMS",
    description:
      "Explore our comprehensive catalog of online courses and start learning today.",
  };
}

export default async function PublicCoursePage({ searchParams }) {
  // Await searchParams before using its properties
  const params = await searchParams;

  // Build query string
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.page) queryParams.set("page", params.page);
  if (params.category) queryParams.set("category", params.category);
  if (params.level) queryParams.set("level", params.level);

  // Fetch courses
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const body = await res.json();
  const courses = body.data;
  const pagination = body.pagination;

  return (
    <div className="mt-5">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Explore Courses</h1>
            <p className="text-muted-foreground mt-2">
              Discover our wide range of courses designed to help you achieve
              your learning goals
            </p>
          </div>

          {/* Search Bar */}
          <div className="lg:max-w-md">
            <CourseSearch />
          </div>
        </div>

        {/* Search Results Info */}
        {params.search && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Search results for:
            </span>
            <Badge variant="secondary" className="text-sm">
              "{params.search}"
            </Badge>
            {pagination && (
              <span className="text-sm text-muted-foreground">
                ({pagination.total} course{pagination.total !== 1 ? "s" : ""}{" "}
                found)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {courses && courses.length > 0 ? (
        <>
          <Suspense fallback={<CSSLoader variant="default" size="md" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <PublicCourseCard key={course._id} course={course} />
              ))}
            </div>
          </Suspense>

          {/* Pagination Info */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}({pagination.total}{" "}
                total courses)
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          {params.search ? (
            <div className="text-center space-y-4">
              <EmptyState />
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground text-sm">
                  We couldn't find any courses matching "{params.search}". Try
                  adjusting your search terms or browse all courses.
                </p>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
}
