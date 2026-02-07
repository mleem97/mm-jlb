"use client";

import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";

import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils/relativeTime";

export function SaveIndicator() {
  const lastSaved = useApplicationStore((s) => s.lastSaved);
  const saveToIndexedDB = useApplicationStore((s) => s.saveToIndexedDB);

  const [isSaving, setIsSaving] = useState(false);
  const [relativeText, setRelativeText] = useState("");

  // Update relative time every 5 seconds
  useEffect(() => {
    const update = () => {
      setRelativeText(formatRelativeTime(lastSaved));
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  const handleManualSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveToIndexedDB();
    } finally {
      setTimeout(() => setIsSaving(false), 600);
    }
  }, [saveToIndexedDB]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {/* Pulsing dot when saving */}
      {isSaving && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
      )}

      {relativeText && (
        <span className="hidden sm:inline">
          Gespeichert {relativeText}
        </span>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleManualSave}
        disabled={isSaving}
        className="h-8 gap-1.5 text-xs"
      >
        <Save className="h-3.5 w-3.5" />
        Jetzt speichern
      </Button>
    </div>
  );
}
