import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.png";
export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-4 top-4",
        })}
      >
        {" "}
        <ArrowLeft></ArrowLeft>
        Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 self-center font-medium"
        >
          {" "}
          <Image src={Logo} height={32} width={32} alt="logo" />
          EasyLMS
        </Link>
        {children}

        <div className="text-sm text-balance text-center text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link href={"#"} className="hover:text-primary">
            Terms of Services
          </Link>{" "}
          &{" "}
          <Link href={"#"} className="hover:text-primary">
            Privacy Policy
          </Link>
          .{" "}
        </div>
      </div>
    </div>
  );
}
