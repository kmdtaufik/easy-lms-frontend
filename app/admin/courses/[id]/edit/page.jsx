import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "../../_components/EditCourseForm";
import { CourseStructure } from "../../_components/CourseStructure";

export default async function EditCoursePage({ params }) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const body = await res.json();
  console.log(body.data);
  const course = body.data;
  return (
    <div className="self-center">
      <h1 className="text-3xl font-bold mb-8">
        Edit Course:
        <span className="text-primary underline">{course.title}</span>
      </h1>
      <Tabs defaultValue="basic-info" className={"w-full md:w-[800px]"}>
        <TabsList className={"grid grid-cols-2 w-full "}>
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic info</CardTitle>
              <CardDescription>Edit Basic Info</CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm course={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>UpdateStructure</CardTitle>
              <CardDescription>Edit Structure Info</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
