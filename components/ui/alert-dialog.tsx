"use client";

import * as React from "react";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Context ──────────────────────────────────────────────── */
const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

/* ─── Root ─────────────────────────────────────────────────── */
function AlertDialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

/* ─── Trigger ──────────────────────────────────────────────── */
function AlertDialogTrigger({
  children,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = React.useContext(AlertDialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props.onClick?.(e);
        setOpen(true);
      },
    });
  }

  return (
    <button type="button" onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
}

/* ─── Portal + Overlay + Content ───────────────────────────── */
function AlertDialogContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = React.useContext(AlertDialogContext);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    },
    [setOpen]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => setOpen(false)}
      />
      {/* Content */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Header / Footer / Title / Description ────────────────── */
function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

/* ─── Action & Cancel ──────────────────────────────────────── */
function AlertDialogAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = React.useContext(AlertDialogContext);
  return (
    <Button
      className={className}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = React.useContext(AlertDialogContext);
  return (
    <Button
      variant="outline"
      className={cn("mt-2 sm:mt-0", className)}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
