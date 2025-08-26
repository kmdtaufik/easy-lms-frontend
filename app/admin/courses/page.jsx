import { buttonVariants } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { AdminCourseCard } from "./_components/AdminCourseCard";

export default async function CoursesPage() {
  let page = 1;
  let limit = 10;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const body = await res.json();
  const data = body.data;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link href={"/admin/courses/create"} className={buttonVariants({})}>
          Create Course
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2  gap-6">
        {data.map((course) => (
          <AdminCourseCard course={course} key={course.id} />
        ))}
      </div>
    </>
  );
}
