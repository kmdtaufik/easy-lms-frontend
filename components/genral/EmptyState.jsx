import { Database, PlusIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center animate-pulse">
          <Database className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <div
          className="absolute inset-0 w-16 h-16 rounded-full border-2 border-muted/10 animate-spin"
          style={{ animationDuration: "3s" }}
        />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-3 text-balance">
        No Data Found
      </h3>
      <p className="text-muted-foreground/80 max-w-md text-balance leading-relaxed text-sm">
        We couldn't find any data to display at this time. Create new or try
        refreshing the page.
      </p>
      <div>
        <Link href={"/admin/courses/create"} className={buttonVariants({})}>
          <PlusIcon className="size-4" /> Create Course
        </Link>
      </div>
    </div>
  );
}
