import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  User,
  Star,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

//metadata
export const metadata = {
  title: "Home | Easy LMS",
  description: "Welcome to Easy LMS, your gateway to modern online learning.",
};

async function getLatestCourses() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product?limit=6`,
      {
        cache: "no-store", // Always fetch fresh data for homepage
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching latest courses:", error);
    return [];
  }
}

export default async function Home() {
  const latestCourses = await getLatestCourses();

  //mock features
  const features = [
    {
      title: "Comprehensive Courses",
      description: "Access a wide range of courses covering various subjects.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
    },
    {
      title: "Interactive Learning",
      description:
        "Engage with interactive content to enhance your learning experience.",
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
    },
    {
      title: "Flexible Schedule",
      description: "Learn at your own pace with flexible course schedules.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Community Support",
      description: "Connect with peers and instructors for help and guidance.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Students Enrolled",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      number: "500+",
      label: "Courses Available",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
    },
    {
      number: "95%",
      label: "Completion Rate",
      icon: <Award className="h-6 w-6 text-primary" />,
    },
    {
      number: "4.8/5",
      label: "Average Rating",
      icon: <Star className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <>
      {/* Hero section */}
      <section className="relative py-20 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="outline" className="text-sm">
            The Future of Online Learning
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your Learning
            <span className="text-primary"> Experience</span>
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
                className: "px-8",
              })}
            >
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "px-8",
              })}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Easy LMS?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform offers everything you need for a successful learning
            journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 group border-0 shadow-md"
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Courses Section */}
      <section className="py-20 bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest Courses
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover our newest and most popular courses
              </p>
            </div>
            <Link
              href="/courses"
              className={buttonVariants({
                variant: "outline",
                className: "hidden md:flex",
              })}
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {latestCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestCourses.map((course) => (
                <Card
                  key={course._id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {course.fileKey ? (
                      <Image
                        src={`https://easy-lms.t3.storage.dev/${course.fileKey}`}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/80 text-white">
                        ${course.price}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{course.level}</Badge>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.smallDescription}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{course.createdBy?.name}</span>
                      </div>
                    </div>

                    <Link href={`/courses/${course.slug || course._id}`}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Courses Available
              </h3>
              <p className="text-muted-foreground">
                Check back soon for new courses!
              </p>
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="text-center mt-8 md:hidden">
            <Link
              href="/courses"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already advancing their skills
              and careers with Easy LMS. Start learning today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className={buttonVariants({
                  size: "lg",
                  className: "px-8",
                })}
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "px-8",
                })}
              >
                Contact Sales
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
