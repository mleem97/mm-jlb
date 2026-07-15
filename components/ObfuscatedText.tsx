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

function decodeObfuscatedValue(encoded: string): string {
  return atob(encoded).replace(/[\r\n]/g, "").trim();
}

export function ObfuscatedText({
  encoded,
  label,
  revealLabel = "anzeigen",
  className,
  multiline = false,
  asLinkType,
}: ObfuscatedTextProps) {
  const [revealed, setRevealed] = useState(false);
  const decoded = revealed ? decodeObfuscatedValue(encoded) : "";
  const content = multiline ? (
    <span className="whitespace-pre-line">{decoded}</span>
  ) : (
    <span>{decoded}</span>
  );

  return (
    <span className={className}>
      {label ? (
        <span className="font-medium text-foreground">{label} </span>
      ) : null}
      {revealed ? (
        asLinkType ? (
          <a
            href={`${asLinkType}:${encodeURI(decoded)}`}
            className="rounded-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background hover:text-primary/80"
          >
            {content}
          </a>
        ) : (
          content
        )
      ) : (
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
          }}
          className="rounded-sm text-primary underline decoration-dotted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background hover:text-primary/80"
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
  const openObfuscatedAction = () => {
    const decoded = decodeObfuscatedValue(encoded);
    const target = `${actionType}:${encodeURI(decoded)}`;
    window.open(target, "_self", "noopener,noreferrer");
  };

  return (
    <Button
      type="button"
      onClick={openObfuscatedAction}
      className={className}
      variant={variant}
      size={size}
    >
      {label}
    </Button>
  );
}
