import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";
import { PlayIcon } from "lucide-react";
import { LessonItem } from "./LessonItem";

export function EnrolledCourseSidebar({ course }) {
  return (
    <div className="flex flex-col h-full ">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3 ">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <PlayIcon className="size-4 text-primary " />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate ">
              {course.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs flex justify-between">
            <span>Progress</span>
            <span>4/10 Lessons</span>
            <Progress value={40} className="h-2 mt-1" />
            <p className="text-xs text-muted-foreground">40% Complete</p>
          </div>
        </div>
      </div>
      <div className="py-4 pr-4 space-y-3">
        {course.chapters.map((chapter) => (
          <Collapsible key={chapter._id} defaultOpen={chapter.position === 1}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 h-auto flex items-center gap-2"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position}:{chapter.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    {chapter.lessons.length} Lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3 ">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson._id}
                  lesson={lesson}
                  slug={course.slug}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
