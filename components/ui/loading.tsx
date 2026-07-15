"use client";

import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

function getSpinnerSizeClass(size: SpinnerSize): string {
  switch (size) {
    case "sm":
      return "size-4 border-2";
    case "md":
      return "size-8 border-[3px]";
    case "lg":
      return "size-12 border-4";
  }
}

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Laden"
      className={cn(
        "animate-spin rounded-full border-muted-foreground/30 border-t-primary",
        getSpinnerSizeClass(size),
        className,
      )}
    >
      <span className="sr-only">Laden…</span>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  message,
  fullScreen = false,
  className,
}: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-label={message ?? "Laden"}
      className={cn(
        "flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm",
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10",
        className,
      )}
    >
      <Spinner size="lg" />
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}
