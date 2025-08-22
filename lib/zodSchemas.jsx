import { z } from "zod";

// enum arrays (as const tuples)
export const courseLevel = ["Beginner", "Intermediate", "Advanced"];
export const courseStatus = ["Draft", "Published", "Archived"];

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title is required and must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),

  fileKey: z.string().min(1, { message: "File key is required" }),

  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),

  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour" }),

  level: z.enum(courseLevel, {
    errorMap: () => ({
      message: "Level must be Beginner, Intermediate, or Advanced",
    }),
  }),

  category: z.string().min(1, { message: "Category is required" }),

  smallDescription: z
    .string()
    .min(10, { message: "Small description must be at least 10 characters" })
    .max(200, {
      message: "Small description must be less than 200 characters",
    }),

  slug: z.string().min(1, { message: "Slug is required" }),

  status: z
    .enum(courseStatus, {
      errorMap: () => ({
        message: "Status must be Draft, Published, or Archived",
      }),
    })
    .default("Draft"),
});
