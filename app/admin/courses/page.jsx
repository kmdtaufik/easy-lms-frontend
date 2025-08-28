import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseCard } from "./_components/AdminCourseCard";
import EmptyState from "@/components/genral/EmptyState";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import CSSLoader from "@/components/loader/loader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  // Get cookies from the request
  const cookieStore = await cookies();

  // Get all cookies as a string to forward to your backend
  const cookieHeader = cookieStore.toString();

  let page = 1;
  let limit = 10;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward all cookies to your Express backend
        Cookie: cookieHeader,
      },
      // Remove credentials: "include" - doesn't work in server components
    }
  );

  if (!res.ok) {
    // If unauthorized, redirect to login
    if (res.status === 401 || res.status === 403) {
      redirect("/login"); // Adjust to your login route
    }
    throw new Error(`Failed to fetch data: ${res.status}`);
  }

  const body = await res.json();
  const data = body.data;

  return (
    <>
      {data && data.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Courses</h1>
            <Link href={"/admin/courses/create"} className={buttonVariants({})}>
              <PlusIcon className="size-4" /> Create Course
            </Link>
          </div>
          <Suspense fallback={<CSSLoader variant="default" size="md" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.map((course) => (
                <AdminCourseCard course={course} key={course.id} />
              ))}
            </div>
          </Suspense>
        </>
      ) : (
        <EmptyState>
          <Link href={"/admin/courses/create"} className={buttonVariants({})}>
            <PlusIcon className="size-4" /> Create Course
          </Link>
        </EmptyState>
      )}
    </>
  );
}
