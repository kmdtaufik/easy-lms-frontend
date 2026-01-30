import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import getUrl from "@/lib/getUrl";
import { ArrowRight } from "lucide-react";
import { School } from "lucide-react";
import { TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

export const PublicCourseCard = memo(function PublicCourseCard({ course }) {
  return (
    <Card className={"group relative py-0 gap-0"}>
      <Badge className={"absolute top-2 right-2"}>{course.level}</Badge>
      <Image
        src={getUrl(course.fileKey)}
        alt={course.title}
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover "
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <CardContent>
        <Link
          href={`/courses/${course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary"
        >
          {course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2 ">
          {course.smallDescription}
        </p>
        <div className="flex items-center mt-4 gap-x-5">
          <div className="flex items-center gap-x-2 ">
            <TimerIcon className="size-6 rounded-md text-primary/10" />
            <p>{course.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2 ">
            <School className="size-6 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.category}</p>
          </div>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className={buttonVariants({
            className: "my-4 w-full ",
          })}
        >
          Learn More <ArrowRight className="size-6" />
        </Link>
      </CardContent>
    </Card>
  );
});
