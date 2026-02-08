"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { History, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/i18n/client";

interface SavedStateDialogProps {
  onContinue: () => void;
  onNewStart: () => void;
}

function detectSavedState(unknownUser: string, unknownDate: string): { name: string; date: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("application-storage");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const state = parsed?.state;
    if (!state) return null;

    const hasPersonalData = state.personalData?.firstName?.length > 0 || state.personalData?.lastName?.length > 0;
    const hasWorkExperience = state.workExperience?.length > 0;
    const hasEducation = state.education?.length > 0;
    const hasSkills = state.skills?.length > 0;
    const hasCoverLetter = state.coverLetter?.introduction?.length > 0 || state.coverLetter?.mainBody?.length > 0;

    if (hasPersonalData || hasWorkExperience || hasEducation || hasSkills || hasCoverLetter) {
      const name = [state.personalData?.firstName, state.personalData?.lastName].filter(Boolean).join(" ") || unknownUser;
      const lastSaved = state.lastSaved ? new Date(state.lastSaved).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) : null;

      return {
        name,
        date: lastSaved || unknownDate,
      };
    }
  } catch {
    // Corrupted storage, ignore
  }
  return null;
}

export function SavedStateDialog({ onContinue, onNewStart }: SavedStateDialogProps) {
  const t = useTranslations("savedState");
  const [savedInfo, setSavedInfo] = useState<{ name: string; date: string } | null>(() =>
    detectSavedState(t("unknownUser"), t("unknownDate"))
  );

  if (!savedInfo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative z-50 w-full max-w-md mx-4"
        >
          <Card className="border-border/50 shadow-2xl">
            <CardContent className="p-6 space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <History className="w-8 h-8 text-indigo-500" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">{t("title")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("description", { name: savedInfo.name })}
                </p>
                {savedInfo.date && (
                  <p className="text-xs text-muted-foreground">
                    {t("lastSaved")}: {savedInfo.date}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSavedInfo(null);
                    onContinue();
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  {t("continue")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSavedInfo(null);
                    onNewStart();
                  }}
                  className="w-full h-11 gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("newStart")}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                {t("hint")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
