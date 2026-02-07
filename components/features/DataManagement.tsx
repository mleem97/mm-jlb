"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useApplicationStore } from "@/store/applicationStore";
import { applicationDb } from "@/lib/db/applicationDb";

export function DataManagement() {
  const [confirmText, setConfirmText] = useState("");
  const resetApplication = useApplicationStore((s) => s.resetApplication);

  const handleDelete = async () => {
    // Reset Zustand store
    resetApplication();

    // Clear IndexedDB tables
    try {
      await applicationDb.applications.clear();
      await applicationDb.attachments.clear();
    } catch {
      // IndexedDB may not be available in some environments
    }

    // Clear localStorage
    try {
      localStorage.removeItem("application-storage");
      localStorage.removeItem("jlb-theme");
      localStorage.removeItem("jlb-privacy-accepted");
    } catch {
      // localStorage may not be available
    }

    setConfirmText("");
    toast.success("Alle Daten wurden gelöscht");

    // Redirect to intro
    window.location.href = "/intro";
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Alle Daten löschen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alle Daten löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Sind Sie sicher? Alle Bewerbungsdaten werden unwiderruflich gelöscht.
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <label
            htmlFor="confirm-delete"
            className="text-sm text-muted-foreground"
          >
            Geben Sie <strong>LÖSCHEN</strong> ein, um zu bestätigen:
          </label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="LÖSCHEN"
            className="mt-2"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Abbrechen
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== "LÖSCHEN"}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            Endgültig löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
