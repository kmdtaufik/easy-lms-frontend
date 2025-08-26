import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School2Icon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AdminCourseCard({ course }) {
  const base = "https://easy-lms.t3.storage.dev/";
  return (
    <Card className={"group relative py-0 gap-0"}>
      {/*absolute dropdown*/}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} size={"icon"}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Pencil className="size-4 mr-2" /> Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.slug}`}>
                <Eye className="size-4 mr-2" /> Preview Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-red-600" /> Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={`${base}${course.fileKey}`}
        alt={course.title}
        width={600}
        height={400}
        className={"w-full rounded-t-lg aspect-video h-full object-cover"}
      />
      <CardContent className={"p-4"}>
        <Link
          href={`/admin/courses/${course.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary"
        >
          {course.title}
        </Link>
        <p className="line-clamp-2  text-sm text-muted-foreground leading-tight mt-2">
          {course.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p>{course.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School2Icon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p>{course.level}</p>
          </div>
        </div>
        <Link
          href={`/admin/courses/${course.id}/edit`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Edit Course <ArrowRight className="size-4" />{" "}
        </Link>
      </CardContent>
    </Card>
  );
}
