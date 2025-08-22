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
          toast.push("Signed out successfully", { theme: "dark" });
        },
        onError: (error) => {
          toast.push("Error signing out.");
        },
      },
    });
  };
  return { handleSignOut };
}
