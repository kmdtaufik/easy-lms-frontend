import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

//metadata
export const metadata = {
  title: "Home | Easy LMS",
  discription: "Welcome to Easy LMS, your gateway to modern online learning.",
};

export default function Home() {
  //mock features
  const features = [
    {
      title: "Comprehensive Courses",
      description: "Access a wide range of courses covering various subjects.",
      icon: "📚",
    },
    {
      title: "Interactive Learning",
      description:
        "Engage with interactive content to enhance your learning experience.",
      icon: "🖥️",
    },
    {
      title: "Flexible Schedule",
      description: "Learn at your own pace with flexible course schedules.",
      icon: "⏰",
    },
    {
      title: "Community Support",
      description: "Connect with peers and instructors for help and guidance.",
      icon: "🤝",
    },
  ];

  return (
    <>
      {/* Hero section */}
      <section className={"relative py-20"}>
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>The Future of Online Learning.</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your Learning Experience
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            {" "}
            Discover a new way to learn with our modern, interactive learning
            management system. Access high quality courses anytime , anywhere.
          </p>
          <div className=" flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href={"/courses"}
              className={buttonVariants({
                size: "lg",
                // variant: "outline",
              })}
            >
              {" "}
              Explore Courses
            </Link>
            <Link
              href={"/login"}
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
            >
              {" "}
              Login
            </Link>
          </div>
        </div>{" "}
      </section>
      <section
        className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 "}
      >
        {features.map((features, index) => (
          <Card key={index} className={"hover:shadow-lg transition-shadow"}>
            <CardHeader>
              <div className=" text-4xl mb-4">{features?.icon}</div>
              <CardTitle>{features?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{features?.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
