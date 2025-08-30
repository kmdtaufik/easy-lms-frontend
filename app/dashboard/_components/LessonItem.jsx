import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { PlayIcon } from "lucide-react";
import Link from "next/link";

export function LessonItem({ slug, lesson }) {
  return (
    <Link
      href={"/dashboard/" + slug + "/" + lesson._id}
      className={buttonVariants({
        variant: lesson.isCompleted ? "secondary" : "outline",
        className: cn(
          "w-full p-3 h-auto justify-start transition-auto",
          lesson.isCompleted &&
            "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
        ),
      })}
    >
      <div className="flex items-center gap-3 w-full min-w-0">
        <div className="shrink-0">
          {lesson.isCompleted ? (
            <div>
              <Check />
            </div>
          ) : (
            <div
              className={cn(
                "size-6 rounded-full border-2 bg-background flex items-center justify-center shrink-0",
              )}
            >
              <PlayIcon className={cn("size-3 fill-current")} />
            </div>
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p
            className={cn(
              "text-xs font-medium truncate",
              lesson.isCompleted && "text-green-800 dark:text-green-200",
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {lesson.isCompleted && (
            <p className="text-[10px] text-green-700 dark:text-green-200 font-medium">
              Completed
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
