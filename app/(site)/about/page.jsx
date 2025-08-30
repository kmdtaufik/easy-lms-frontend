import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Award,
  Target,
  Heart,
  Lightbulb,
  Globe,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";

// Metadata
export const metadata = {
  title: "About Us | Easy LMS",
  description:
    "Learn more about Easy LMS, our mission, vision, and the team behind the modern online learning platform.",
};

export default function AboutPage() {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      number: "10,000+",
      label: "Students Enrolled",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      number: "500+",
      label: "Courses Available",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      number: "95%",
      label: "Completion Rate",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      number: "50+",
      label: "Countries Reached",
    },
  ];

  const values = [
    {
      icon: <Target className="h-12 w-12 text-primary" />,
      title: "Excellence",
      description:
        "We strive for excellence in every course, ensuring high-quality content and learning experiences.",
    },
    {
      icon: <Heart className="h-12 w-12 text-primary" />,
      title: "Accessibility",
      description:
        "Making quality education accessible to everyone, regardless of their background or location.",
    },
    {
      icon: <Lightbulb className="h-12 w-12 text-primary" />,
      title: "Innovation",
      description:
        "Continuously innovating our platform to provide the best modern learning tools and technologies.",
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Community",
      description:
        "Building a supportive learning community where students and instructors can thrive together.",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
      description:
        "10+ years in EdTech, passionate about democratizing education.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description:
        "Former Google engineer, expert in scalable learning platforms.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Content",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      description:
        "Educational psychologist with 15+ years curriculum development experience.",
    },
    {
      name: "David Kim",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face",
      description:
        "Award-winning UX designer focused on intuitive learning experiences.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Easy LMS Founded",
      description:
        "Started with a vision to make quality education accessible to everyone.",
    },
    {
      year: "2021",
      title: "First 1,000 Students",
      description:
        "Reached our first major milestone with students from 20 countries.",
    },
    {
      year: "2022",
      title: "Mobile App Launch",
      description:
        "Launched mobile applications for iOS and Android platforms.",
    },
    {
      year: "2023",
      title: "AI Integration",
      description:
        "Introduced AI-powered personalized learning recommendations.",
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve students in over 50 countries worldwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="mx-auto">
              About Easy LMS
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Empowering Minds Through
              <span className="text-primary"> Modern Learning</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              We're on a mission to revolutionize online education by creating
              an accessible, engaging, and effective learning platform for
              everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Mission & Vision
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Mission
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To democratize access to high-quality education by
                      providing an intuitive, feature-rich learning management
                      system that empowers both educators and learners to
                      achieve their full potential.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Vision
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To become the world's most trusted and innovative online
                      learning platform, where knowledge knows no boundaries and
                      every learner can pursue their dreams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Student-centered learning approach",
                  "Cutting-edge technology integration",
                  "Global accessibility and inclusion",
                  "Continuous innovation and improvement",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <Image
                  src={Logo}
                  alt="Easy LMS"
                  width={200}
                  height={200}
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These values guide everything we do and shape the culture of our
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-6">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Easy LMS, dedicated to
              transforming education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey/Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones that have shaped Easy LMS into what it is today.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary/20"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already advancing their
                skills and careers with Easy LMS.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/courses"
                  className={buttonVariants({
                    size: "lg",
                    className: "px-8",
                  })}
                >
                  Explore Courses
                </Link>
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "px-8",
                  })}
                >
                  Contact Us
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
