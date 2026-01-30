"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import RichTextEditor to reduce initial bundle size
// TipTap and its dependencies are quite large (~200kb), so we load them only when needed
const RichTextEditor = dynamic(
  () =>
    import("./RichTextEditor").then((mod) => ({
      default: mod.RichTextEditor,
    })),
  {
    loading: () => (
      <div className="border rounded-lg border-input overflow-hidden">
        <Skeleton className="h-12 w-full rounded-b-none" />
        <Skeleton className="h-[300px] w-full rounded-t-none" />
      </div>
    ),
    ssr: false, // Disable server-side rendering for the editor
  }
);

export default RichTextEditor;
