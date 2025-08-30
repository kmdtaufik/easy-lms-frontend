"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Ban,
  Crown,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Optional: enrollment stats (unchanged)
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  // Fetch single user: Better Auth has no direct getUser,
  // so we request listUsers filtered by id (filterField / filterValue).
  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          filterField: "id",
          filterValue: id,
          filterOperator: "eq",
          limit: 1,
        },
      });
      if (error) throw new Error(error.message || "Failed to load user");
      const fetched = data?.users?.[0];
      setUser(fetched || null);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Unable to load user");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchUserEnrollments = async () => {
    setEnrollmentsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/enrollment/user/${id}?limit=25`,
        { credentials: "include" }
      );
      if (res.ok) {
        const json = await res.json();
        setEnrollments(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchUserEnrollments();
    }
  }, [id]);

  if (loadingUser) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This user does not exist or was removed.
          </p>
          <Link href="/admin/users">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "-";
  const updatedAt = user.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString()
    : "-";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {(user.name || "?").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="flex items-center gap-1 capitalize"
                  >
                    {user.role === "admin" ? (
                      <Crown className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {user.role}
                  </Badge>
                  <Badge
                    variant={user.banned ? "destructive" : "secondary"}
                    className={
                      user.banned
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {user.banned ? (
                      <>
                        <Ban className="h-3 w-3 mr-1" />
                        Banned
                      </>
                    ) : (
                      "Active"
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoRow label="Email">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </InfoRow>
                <InfoRow label="Email Verified">
                  <Badge
                    variant={user.emailVerified ? "default" : "destructive"}
                  >
                    {user.emailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </InfoRow>
                <InfoRow label="Created">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{createdAt}</span>
                  </div>
                </InfoRow>
                <InfoRow label="Updated">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{updatedAt}</span>
                  </div>
                </InfoRow>
              </div>

              <div className="space-y-4">
                <InfoRow label="User ID">
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {user.id || user._id}
                  </span>
                </InfoRow>
                {user.banned && user.banReason && (
                  <InfoRow label="Ban Reason">
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">{user.banReason}</span>
                    </div>
                  </InfoRow>
                )}
                {user.banned && user.banExpires && (
                  <InfoRow label="Ban Expires">
                    <span className="text-sm">
                      {new Date(user.banExpires).toLocaleDateString()}
                    </span>
                  </InfoRow>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simple stats using enrollment data (optional) */}
        <div className="space-y-6">
          <StatCard
            icon={BookOpen}
            title="Enrollments"
            value={enrollments.length}
            subtitle="Total enrollments"
          />
          <StatCard
            icon={GraduationCap}
            title="Completed"
            value={enrollments.filter((e) => e.status === "completed").length}
            subtitle="Completed courses"
          />
          <StatCard
            icon={Activity}
            title="Active"
            value={enrollments.filter((e) => e.status === "active").length}
            subtitle="Active enrollments"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recent Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollmentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.slice(0, 5).map((en) => (
                <div
                  key={en._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-muted rounded flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{en.course?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(en.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      en.status === "completed"
                        ? "default"
                        : en.status === "active"
                        ? "secondary"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {en.status}
                  </Badge>
                </div>
              ))}
              {enrollments.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing 5 of {enrollments.length}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No enrollments
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
