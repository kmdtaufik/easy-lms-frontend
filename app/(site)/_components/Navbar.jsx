"use client";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Link from "next/link";
import { ToggleTheme } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";

const navigationItems = [
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  //   { name: "Dashboard", href: "/dashboard" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src={Logo} alt="Logo" className="size-9" loading="lazy" />
          <span className=" font-bold">Easy LMS</span>
        </Link>

        {/* Desktop navigation  */}
        <nav className="hidden md:flex md:flex-1 md: items-center md:justify-between">
          <div className="flex items-center space-x-2">
            {" "}
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center  space-x-4">
            <ToggleTheme />
            {isPending ? null : session ? (
              <UserDropdown
                email={session?.user?.email}
                name={session?.user?.name || session?.user?.email || "User"}
                image={session?.user?.image || ""}
                role={session?.user?.role || "user"}
              />
            ) : (
              <>
                <Link
                  href={"/login"}
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Login
                </Link>
                <Link href={"/signup"} className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
