"use client";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Link from "next/link";
import { useState } from "react";
import { ToggleTheme } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex min-h-16 items-center justify-between mx-auto px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={closeMobileMenu}
        >
          <Image src={Logo} alt="Logo" className="size-9" loading="lazy" />
          <span className="font-bold">Easy LMS</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between md:ml-8">
          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ToggleTheme />
            {isPending ? (
              <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
            ) : session ? (
              <UserDropdown
                email={session?.user?.email}
                name={session?.user?.name || session?.user?.email || "User"}
                image={session?.user?.image || ""}
                role={session?.user?.role || "user"}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ToggleTheme />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="h-9 w-9 p-0"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          isMobileMenuOpen ? "block" : "hidden"
        )}
      >
        <nav className="container mx-auto px-4 py-4 space-y-2">
          {/* Navigation Links */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary hover:bg-muted rounded-md"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t pt-4">
            {isPending ? (
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
                <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              </div>
            ) : session ? (
              <div className="space-y-2">
                {/* User Info */}
                <div className="flex items-center space-x-3 px-3 py-2 bg-muted/50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium text-primary">
                        {(session.user?.name || session.user?.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                {/* User Actions */}
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted rounded-md"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted rounded-md"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      authClient.signOut();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full justify-center",
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className={buttonVariants({
                    className: "w-full justify-center",
                  })}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
