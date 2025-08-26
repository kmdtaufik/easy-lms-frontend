"use client";
import { cn } from "@/lib/utils";

export default function LMSLoader({
  className,
  size = "md",
  variant = "skeleton",
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (variant === "skeleton") {
    return (
      <div className={cn("min-h-screen bg-background p-6", className)}>
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted/60 rounded animate-pulse [animation-delay:0.2s]" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse [animation-delay:0.4s]" />
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse [animation-delay:0.6s]" />
            <div className="w-32 h-8 bg-muted rounded animate-pulse [animation-delay:0.8s]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar skeleton */}
          <div className="lg:col-span-1 space-y-4">
            <div className="h-8 w-full bg-muted rounded animate-pulse" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 bg-muted/60 rounded animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  <div
                    className="h-4 flex-1 bg-muted/60 rounded animate-pulse"
                    style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Course cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border border-border rounded-lg p-4 space-y-4"
                >
                  <div
                    className="aspect-video bg-muted rounded animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                  <div className="space-y-2">
                    <div
                      className="h-5 w-3/4 bg-muted rounded animate-pulse"
                      style={{ animationDelay: `${i * 0.15 + 0.1}s` }}
                    />
                    <div
                      className="h-4 w-full bg-muted/60 rounded animate-pulse"
                      style={{ animationDelay: `${i * 0.15 + 0.2}s` }}
                    />
                    <div
                      className="h-4 w-2/3 bg-muted/60 rounded animate-pulse"
                      style={{ animationDelay: `${i * 0.15 + 0.3}s` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 bg-muted/60 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.15 + 0.4}s` }}
                      />
                      <div
                        className="h-4 w-16 bg-muted/60 rounded animate-pulse"
                        style={{ animationDelay: `${i * 0.15 + 0.5}s` }}
                      />
                    </div>
                    <div
                      className="h-6 w-20 bg-muted rounded animate-pulse"
                      style={{ animationDelay: `${i * 0.15 + 0.6}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Progress section skeleton */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div
                      className="w-16 h-16 bg-muted rounded-full mx-auto animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                    <div
                      className="h-4 w-20 bg-muted/60 rounded mx-auto animate-pulse"
                      style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
                    />
                    <div
                      className="h-6 w-12 bg-muted rounded mx-auto animate-pulse"
                      style={{ animationDelay: `${i * 0.2 + 0.2}s` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity skeleton */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="h-6 w-40 bg-muted rounded animate-pulse" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 bg-muted rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                    <div className="flex-1 space-y-2">
                      <div
                        className="h-4 w-3/4 bg-muted/60 rounded animate-pulse"
                        style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
                      />
                      <div
                        className="h-3 w-1/2 bg-muted/40 rounded animate-pulse"
                        style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
                      />
                    </div>
                    <div
                      className="h-4 w-16 bg-muted/60 rounded animate-pulse"
                      style={{ animationDelay: `${i * 0.1 + 0.15}s` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating loading indicator */}
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2 shadow-lg">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground animate-pulse [animation-delay:0.2s]">
            Loading content...
          </span>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="relative">
          <div
            className={cn(
              "rounded-full border-4 border-transparent bg-gradient-to-r from-primary via-primary/60 to-transparent",
              "animate-spin [animation-duration:1.2s] [animation-timing-function:cubic-bezier(0.4,0,0.6,1)]",
              "bg-clip-padding",
              sizeClasses[size],
            )}
            style={{
              background: `conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent)`,
              mask: `radial-gradient(circle at center, transparent 40%, black 42%)`,
              WebkitMask: `radial-gradient(circle at center, transparent 40%, black 42%)`,
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === "educational") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-6",
          className,
        )}
      >
        <div className="relative">
          <div className="relative w-14 h-11">
            {/* Book spine */}
            <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-primary to-primary/80 rounded-l-md shadow-sm" />

            {/* Animated pages */}
            <div className="absolute left-1 inset-y-0 right-0">
              <div className="absolute inset-0 bg-gradient-to-br from-card to-card/90 rounded-r-md shadow-md transform origin-left animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-r-md transform origin-left rotate-2 animate-pulse [animation-delay:0.3s] [animation-duration:2s]" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-r-md transform origin-left rotate-1 animate-pulse [animation-delay:0.6s] [animation-duration:2s]" />
            </div>

            {/* Book details */}
            <div className="absolute left-2 top-2 right-1 space-y-1">
              <div className="h-1 bg-primary/30 rounded animate-pulse [animation-delay:0.2s]" />
              <div className="h-1 bg-primary/20 rounded w-3/4 animate-pulse [animation-delay:0.4s]" />
              <div className="h-1 bg-primary/15 rounded w-1/2 animate-pulse [animation-delay:0.6s]" />
            </div>
          </div>
        </div>

        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0s] [animation-duration:1.4s]" />
          <div className="w-2.5 h-2.5 bg-primary/80 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1.4s]" />
          <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1.4s]" />
        </div>

        <p className="text-sm text-muted-foreground animate-pulse [animation-duration:2s] font-medium">
          Preparing your learning journey...
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Outer rotating ring with gradient */}
        <div
          className={cn(
            "rounded-full border-4 border-transparent animate-spin [animation-duration:2s]",
            sizeClasses[size],
          )}
          style={{
            background: `conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--primary)/.6), transparent, transparent, hsl(var(--primary)))`,
            mask: `radial-gradient(circle at center, transparent 35%, black 37%)`,
            WebkitMask: `radial-gradient(circle at center, transparent 35%, black 37%)`,
          }}
        />

        {/* Middle pulsing ring */}
        <div
          className={cn(
            "absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse [animation-duration:1.5s]",
          )}
        />

        {/* Inner spinning core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-br from-primary to-primary/70 rounded-full animate-spin [animation-duration:1s] shadow-sm" />
        </div>

        {/* Orbiting particles */}
        <div
          className={cn(
            "absolute inset-0 animate-spin [animation-duration:4s] [animation-direction:reverse]",
          )}
        >
          <div className="absolute top-1 left-1/2 w-1.5 h-1.5 bg-primary/70 rounded-full transform -translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-1 left-1/2 w-1.5 h-1.5 bg-primary/50 rounded-full transform -translate-x-1/2 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute left-1 top-1/2 w-1 h-1 bg-primary/40 rounded-full transform -translate-y-1/2 animate-pulse [animation-delay:1s]" />
          <div className="absolute right-1 top-1/2 w-1 h-1 bg-primary/40 rounded-full transform -translate-y-1/2 animate-pulse [animation-delay:1.5s]" />
        </div>

        {/* Subtle glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-primary/5 animate-pulse [animation-duration:3s]",
            "blur-sm",
          )}
        />
      </div>
    </div>
  );
}
