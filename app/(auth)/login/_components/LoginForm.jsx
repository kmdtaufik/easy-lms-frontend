"use client";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useTransition, useEffect } from "react";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import { Loader, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [pwPassword, setPwPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { data: session } = authClient.useSession();
  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  const callback = process.env.CLIENT_URL;
  async function signInWithGoogle() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "https://easy-lms-frontend.vercel.app",
        fetchOptions: {
          onSuccess: () => toast.success("Login successful"),
          onError: () => toast.error("Google login failed"),
        },
      });
    });
  }

  function signInWithEmailOtp() {
    startTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("OTP sent");
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          },
          onError: () => toast.error("Failed to send OTP"),
        },
      });
    });
  }

  function signInWithPassword() {
    if (!pwEmail || !pwPassword) return;
    startTransition(async () => {
      try {
        const { error } = await authClient.signIn.password({
          email: pwEmail,
          password: pwPassword,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged in");
              router.push("/dashboard");
            },
            onError: () => toast.error("Password login failed"),
          },
        });
        if (error) toast.error(error.message || "Login failed");
      } catch (e) {
        toast.error(e.message || "Unexpected error");
      }
    });
  }

  if (session) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to continue</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Button
          disabled={isPending}
          variant="outline"
          className="w-full"
          onClick={signInWithGoogle}
        >
          {isPending ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Continue with Google"
          )}
        </Button>

        <div className="relative text-center text-xs text-muted-foreground">
          <span className="bg-card px-2 relative z-10">or</span>
          <div className="absolute inset-0 flex items-center -z-0">
            <div className="w-full border-t" />
          </div>
        </div>

        {/* Password Login */}
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="pw-email">Email (password login)</Label>
            <Input
              id="pw-email"
              type="email"
              value={pwEmail}
              onChange={(e) => setPwEmail(e.target.value)}
              placeholder="user@domain.com"
              autoComplete="username"
            />
            <Label htmlFor="pw-password">Password</Label>
            <div className="flex gap-2">
              <Input
                id="pw-password"
                type={showPassword ? "text" : "password"}
                value={pwPassword}
                onChange={(e) => setPwPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              disabled={isPending || !pwEmail || !pwPassword}
              onClick={signInWithPassword}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Login with Password
            </Button>
          </div>
        </div>

        <div className="relative text-center text-xs text-muted-foreground">
          <span className="bg-card px-2 relative z-10">or use email OTP</span>
          <div className="absolute inset-0 flex items-center -z-0">
            <div className="w-full border-t" />
          </div>
        </div>

        {/* Email OTP */}
        <div className="grid gap-2">
          <Label htmlFor="otp-email">Email (OTP)</Label>
          <Input
            id="otp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@domain.com"
          />
          <Button
            onClick={signInWithEmailOtp}
            disabled={isPending || !email.trim()}
          >
            {isPending ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Continue with Email OTP
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Need an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
