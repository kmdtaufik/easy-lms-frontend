"use mobile";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSignOut() {
  const router = useRouter();
  const handleSignOut = async function () {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // console.log("Successfully signed out");
          toast.success("Successfully signed out");
          router.push("/login");
        },
        onError: (error) => {
          toast.error("Could not sign out: ");
        },
      },
    });
  };
  return handleSignOut;
}
