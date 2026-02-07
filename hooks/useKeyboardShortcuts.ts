"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useApplicationStore } from "@/store/applicationStore";

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+S → Save
      if (ctrl && e.key === "s") {
        e.preventDefault();
        useApplicationStore
          .getState()
          .saveToIndexedDB()
          .then(() => {
            toast.success("Gespeichert");
          });
        return;
      }

      // Ctrl+ArrowRight → Next step
      if (ctrl && e.key === "ArrowRight") {
        e.preventDefault();
        useApplicationStore.getState().nextStep();
        return;
      }

      // Ctrl+ArrowLeft → Previous step
      if (ctrl && e.key === "ArrowLeft") {
        e.preventDefault();
        useApplicationStore.getState().prevStep();
        return;
      }

      // Escape → close dialog/form (dispatches Escape to active element / document)
      // The native Escape event is already handled by AlertDialog and other overlays,
      // so we don't need to prevent default here – just let it propagate naturally.
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
