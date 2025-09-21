"use client";

import { useState, useTransition, useEffect } from "react";
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function SignupPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const callback = process.env.CLIENT_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const canSubmit =
    form.name.trim() && form.email.trim() && form.password.length >= 6;

  const handleSignupPassword = () => {
    if (!canSubmit) return;
    startTransition(async () => {
      try {
        // Assumes password/email provider enabled in Better Auth
        const { error } = await authClient.signUp.email({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Account created");
              router.push(callback);
            },
            onError: () => {
              toast.error("Sign up failed");
            },
          },
        });
        if (error) toast.error(error.message || "Sign up failed");
      } catch (e) {
        toast.error(e.message || "Unexpected error");
      }
    });
  };

  const handleGoogle = () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "https://easy-lms-frontend.vercel.app",
        fetchOptions: {
          onSuccess: () => toast.success("Signed up"),
          onError: () => toast.error("Google sign up failed"),
        },
      });
    });
  };

  if (session) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Sign up with email & password or continue with Google.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="outline"
          disabled={isGooglePending}
          onClick={handleGoogle}
          className="w-full"
        >
          {isGooglePending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
            </>
          ) : (
            <>
              <IconBrandGoogle className="size-4" /> Continue with Google
            </>
          )}
        </Button>
        <div className="relative text-center text-xs text-muted-foreground">
          <span className="bg-card px-2 relative z-10">or</span>
          <div className="absolute inset-0 flex items-center -z-0">
            <div className="w-full border-t" />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={onChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password (min 8 chars)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <Button
          disabled={!canSubmit || isPending}
          onClick={handleSignupPassword}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
