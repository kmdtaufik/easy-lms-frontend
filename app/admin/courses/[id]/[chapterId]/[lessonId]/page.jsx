import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditLessonForm } from "./_components/EditLessonForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function LessonPage({ params }) {
  const { id, chapterId, lessonId } = await params;

  // Fetch lesson data
  const lessonRes = await fetch(`${API_BASE_URL}/api/lesson/${lessonId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!lessonRes.ok) {
    throw new Error("Failed to fetch lesson");
  }

  const lesson = await lessonRes.json();

  // Fetch course data for context
  const courseRes = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!courseRes.ok) {
    throw new Error("Failed to fetch course");
  }

  const courseData = await courseRes.json();
  const course = courseData.data;

  // Find the current chapter
  const chapter = course.chapters.find((ch) => ch._id === chapterId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground mb-2">
          <span>{course.title}</span> → <span>{chapter?.title}</span> →{" "}
          <span className="text-foreground">{lesson.title}</span>
        </nav>
        <h1 className="text-3xl font-bold">
          Edit Lesson: <span className="text-primary">{lesson.title}</span>
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditLessonForm lesson={lesson} courseId={id} chapterId={chapterId} />
        </CardContent>
      </Card>
    </div>
  );
}
