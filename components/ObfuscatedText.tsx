"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type ObfuscatedTextProps = {
  encoded: string;
  label?: string;
  revealLabel?: string;
  className?: string;
  multiline?: boolean;
  asLinkType?: "mailto" | "tel";
};

export function ObfuscatedText({
  encoded,
  label,
  revealLabel = "anzeigen",
  className,
  multiline = false,
  asLinkType,
}: ObfuscatedTextProps) {
  const [revealed, setRevealed] = useState(false);
  const decoded = revealed ? atob(encoded) : "";
  const content = multiline ? (
    <span className="whitespace-pre-line">{decoded}</span>
  ) : (
    <span>{decoded}</span>
  );

  return (
    <span className={className}>
      {label ? <span className="font-medium text-foreground">{label} </span> : null}
      {revealed ? (
        asLinkType ? (
          <a
            href={`${asLinkType}:${decoded}`}
            className="text-indigo-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
          >
            {content}
          </a>
        ) : (
          content
        )
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="text-indigo-500 hover:text-indigo-600 underline decoration-dotted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
        >
          {revealLabel}
        </button>
      )}
    </span>
  );
}

type ObfuscatedActionProps = {
  encoded: string;
  actionType: "mailto" | "tel";
  label: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
};

export function ObfuscatedAction({
  encoded,
  actionType,
  label,
  className,
  variant,
  size,
}: ObfuscatedActionProps) {
  const handleClick = () => {
    const decoded = atob(encoded);
    window.location.href = `${actionType}:${decoded}`;
  };

  return (
    <Button type="button" onClick={handleClick} className={className} variant={variant} size={size}>
      {label}
    </Button>
  );
}