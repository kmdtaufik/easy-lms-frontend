"use client";
import { AppSidebar } from "./_components/dash-board-side-bar";
import { SiteHeader } from "@/components/dashboard/site-header";
import CSSLoader from "@/components/loader/loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after we know the session status
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  // Show loader while checking auth or if redirect is happening
  if (isPending || !session) {
    return <CSSLoader />;
  }

  // User is authenticated and is admin
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
