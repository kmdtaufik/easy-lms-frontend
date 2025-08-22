"use client";

import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();
  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully", { theme: "dark" });
        },
        onError: (error) => {
          toast.error(error.message);
          if (process.env.NODE_ENV !== "production")
            console.log("Sign out error: ", error);
        },
      },
    });
  };
  return handleSignOut;
}
