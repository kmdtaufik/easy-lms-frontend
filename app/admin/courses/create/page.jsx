"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { courseSchema } from "@/lib/zodSchemas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sparkle } from "lucide-react";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";

export default function CreateCoursePage() {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      filekey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "",
      status: "Draft",
      slug: "",
      smallDescription: "",
    },
  });

  function onSubmit(data) {
    if (process.env.NODE_ENV === "development") {
      console.log("Form Data:", data);
    }
  }

  return (
    <>
      <div className="flex items-center flex-row gap-4">
        <Link
          href={"/admin/courses"}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-4"></ArrowLeft>{" "}
        </Link>
        <h1 className="text-2xl font-bold">Course Information</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Provide basic Information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {" "}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Title</FormLabel>{" "}
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className={"w-full"}>
                      {" "}
                      <FormLabel>Slug</FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="slug" {...field} />
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const slug = slugify(form.getValues("title"));
                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                >
                  Generate <Sparkle className="ml-1 size-4" />{" "}
                </Button>
              </div>
              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem className={"w-full"}>
                    {" "}
                    <FormLabel>Small Description</FormLabel>{" "}
                    <FormControl>
                      <Textarea
                        placeholder="Small Description"
                        {...field}
                        className={"min-h-[120px]"}
                      />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className={"w-full"}>
                    {" "}
                    <FormLabel>Description</FormLabel>{" "}
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        {...field}
                        className={"min-h-[120px]"}
                      />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              {/* {Todo: get eveything else done by ai} */}
            </form>
          </Form>{" "}
        </CardContent>
      </Card>
    </>
  );
}
