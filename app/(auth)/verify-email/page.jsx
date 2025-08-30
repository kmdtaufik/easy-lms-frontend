"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRoute() {
  return (
    <Suspense>
      <VerifyRequest />
    </Suspense>
  );
}

function VerifyRequest() {
  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const isOTPValid = otp.length === 6;
  // Function to handle OTP verification
  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("OTP verified successfully!");
            router.push("/");
          },
          onError: (error) => {
            toast.error(`OTP verification failed.`);
          },
        },
      });
    });
  }
  return (
    <Card className={"w-full mx-auto"}>
      <CardHeader className={"text-center"}>
        <CardTitle className={"text-xl"}>Please check your email</CardTitle>
        <CardDescription>
          We have sent you a verification email. Please check your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent className={"space-y-6"}>
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0}></InputOTPSlot>
              <InputOTPSlot index={1}></InputOTPSlot>
              <InputOTPSlot index={2}></InputOTPSlot>
            </InputOTPGroup>
            <InputOTPSeparator></InputOTPSeparator>
            <InputOTPGroup>
              {" "}
              <InputOTPSlot index={3}></InputOTPSlot>
              <InputOTPSlot index={4}></InputOTPSlot>
              <InputOTPSlot index={5}></InputOTPSlot>
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter your 6-digit code.
          </p>
        </div>
        <Button
          className={"w-full"}
          onClick={verifyOtp}
          disabled={isPending || !isOTPValid}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin"></Loader2>
            </>
          ) : (
            "Verify Request"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
