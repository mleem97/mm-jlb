"use client";

import { cn } from "@/lib/utils";

const maxWidthMap = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
} as const;

type MaxWidth = keyof typeof maxWidthMap;

interface ResponsiveContainerProps {
  maxWidth?: MaxWidth;
  padding?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ResponsiveContainer({
  maxWidth = "xl",
  padding = true,
  className,
  children,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthMap[maxWidth],
        padding && "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
