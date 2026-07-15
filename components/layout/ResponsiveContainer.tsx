"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MaxWidth = "sm" | "md" | "lg" | "xl";

function getMaxWidthClass(maxWidth: MaxWidth): string {
  switch (maxWidth) {
    case "sm":
      return "max-w-screen-sm";
    case "md":
      return "max-w-screen-md";
    case "lg":
      return "max-w-screen-lg";
    case "xl":
      return "max-w-screen-xl";
  }
}

interface ResponsiveContainerProps {
  maxWidth?: MaxWidth;
  padding?: boolean;
  className?: string;
  children: ReactNode;
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
        getMaxWidthClass(maxWidth),
        padding && "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
