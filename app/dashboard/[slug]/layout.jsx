import { authClient } from "@/lib/auth";
import { EnrolledCourseSidebar } from "../_components/EnrolledCourseSidebar";
import { cookies } from "next/headers";

export default async function EnrolledCoursePageLayout({ children, params }) {
  const { slug } = await params;
  // Get cookies from the request
  const cookieStore = await cookies();

  // Get all cookies as a string to forward to your backend
  const cookieHeader = cookieStore.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/slug/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward all cookies to your Express backend
        Cookie: cookieHeader,
      },
    }
  );
  if (!res.ok) {
    const errorBody = await res.json();
    const error = errorBody.message;

    throw new Error(`Failed to fetch data: ${res.status} - ${error}`);
  }

  const body = await res.json();
  const course = body.data;

  return (
    <div className="flex flex-1">
      {/* sidebar 30% */}
      <div className="w-80 border-r border-border shrink-0">
        <EnrolledCourseSidebar course={course} />
      </div>
      {/* main content 70% */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
