"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  Shield,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function EnrollPage({ params }) {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [slug, setSlug] = useState(null);
  const [session, setSession] = useState(null);

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
  });

  // Extract slug from params
  useEffect(() => {
    const getSlug = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };
    getSlug();
  }, [params]);

  // Get auth session
  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        setSession(sessionData);
      } catch (error) {
        console.error("Error getting session:", error);
      }
    };
    getSession();
  }, []);

  // Fetch course when slug is available
  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  // Check enrollment when both session and course are available
  useEffect(() => {
    if (session && course?._id) {
      checkEnrollment(course._id);
    }
  }, [session, course, slug]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/product/slug/${slug}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Course not found");
      }

      const data = await response.json();
      setCourse(data.data);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details");
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async (courseId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/enrollment/check/${courseId}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.isEnrolled);

        if (data.isEnrolled) {
          toast.info("You are already enrolled in this course.");
          router.push(`/dashboard/${slug}`);
        }
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number (add spaces every 4 digits)
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19) return; // Max length with spaces
    }

    // Format expiry date (MM/YY)
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length >= 2) {
        formattedValue =
          formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    // Format CVV (numbers only, max 4 digits)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 4) return;
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardName, email } = paymentData;

    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      toast.error("Please enter a valid card number");
      return false;
    }

    if (!expiryDate || expiryDate.length < 5) {
      toast.error("Please enter a valid expiry date");
      return false;
    }

    if (!cvv || cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return false;
    }

    if (!cardName.trim()) {
      toast.error("Please enter the cardholder name");
      return false;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!session) {
      toast.error("Please login to Enroll in the course.");
      router.push("/login");
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Now enroll the user
      const enrollResponse = await fetch(`${API_BASE_URL}/api/enrollment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          courseId: course._id,
        }),
      });

      if (!enrollResponse.ok) {
        const errorData = await enrollResponse.json();
        throw new Error(errorData.message || "Failed to enroll in course");
      }

      const enrollData = await enrollResponse.json();

      // Demo payment always succeeds
      toast.success("Payment processed successfully!");
      setEnrollmentSuccess(true);
      toast.success("Successfully enrolled in course!");

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/courses/${slug}`);
      }, 2000);
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Login to Enroll in the course.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <Link href="/courses" className="text-primary hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  if (enrollmentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">
                Enrollment Successful!
              </h1>
              <p className="text-muted-foreground mb-4">
                You have been successfully enrolled in{" "}
                <strong>{course.title}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to course page...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Course
          </Link>
          <h1 className="text-3xl font-bold">Complete Your Enrollment</h1>
          <p className="text-muted-foreground">
            You're just one step away from accessing this course
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.fileKey && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={`https://easy-lms.t3.storage.dev/${course.fileKey}`}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-muted-foreground mt-1">
                    {course.smallDescription}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary">{course.level}</Badge>
                  {course.duration && (
                    <span className="text-muted-foreground">
                      {course.duration}h duration
                    </span>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold">${course.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Demo Payment Notice */}
            <Card className="mt-4 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      Demo Payment
                    </h4>
                    <p className="text-sm text-yellow-700">
                      This is a demo payment system. Any card details will be
                      accepted for testing purposes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnrollment} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={paymentData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Separator />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing Payment...
                      </>
                    ) : (
                      `Pay $${course.price} & Enroll`
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this purchase, you agree to our terms of
                    service. This is a demo payment that will always succeed.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
