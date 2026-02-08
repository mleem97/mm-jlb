"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Info,
  Pencil,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useTranslations } from "@/i18n/client";
import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { OnlineStatus } from "@/components/ui/online-status";
import { formatRelativeTime } from "@/lib/utils/relativeTime";
import {
  workExperienceFormSchema,
  type WorkExperienceFormData,
} from "@/lib/schemas/workExperienceFormSchema";
import {
  detectGaps,
  formatGapDuration,
  formatYearMonth,
  type GapInfo,
} from "@/lib/utils/gapDetection";
import type { WorkExperience } from "@/types/workExperience";

// ─── Constants ─────────────────────────────────────────────
const MONTHS = [
  { value: "01", label: "Januar" },
  { value: "02", label: "Februar" },
  { value: "03", label: "März" },
  { value: "04", label: "April" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Dezember" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => currentYear - i);

const GAP_EXPLANATION_PRESETS = [
  "Elternzeit",
  "Sabbatical",
  "Weiterbildung",
  "Arbeitssuche",
  "Sonstiges",
] as const;

// ─── Smart-Tip content ────────────────────────────────────
const smartTips = [
  {
    title: "Erfolge quantifizieren",
    tip: 'Beschreiben Sie Erfolge quantifizierbar (z.\u00a0B. "+20\u00a0% Umsatz", "30\u00a0% schnellere Ladezeiten").',
  },
  {
    title: "Relevanz betonen",
    tip: "Betonen Sie Aufgaben und Erfolge, die zur gewünschten Stelle passen.",
  },
  {
    title: "Lücken erklären",
    tip: "Lücken im Lebenslauf sind normal — erklären Sie sie kurz und ehrlich.",
  },
  {
    title: "Aktionsverben verwenden",
    tip: 'Starten Sie Aufgaben mit starken Verben: "Entwickelte", "Koordinierte", "Optimierte".',
  },
];

// ─── Sortable Position Card ───────────────────────────────
function SortablePositionCard({
  position,
  onEdit,
  onDelete,
}: {
  position: WorkExperience;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: position.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dateRange = position.isCurrentJob
    ? `${formatYearMonth(position.startDate)} — Heute`
    : position.endDate
      ? `${formatYearMonth(position.startDate)} — ${formatYearMonth(position.endDate)}`
      : formatYearMonth(position.startDate);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 flex items-start gap-3 group hover:shadow-md transition-shadow">
        {/* Drag Handle */}
        <button
          type="button"
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          {...attributes}
          {...listeners}
          aria-label="Position verschieben"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold truncate">{position.jobTitle}</h4>
              <p className="text-sm text-muted-foreground truncate">{position.company}</p>
            </div>
            {position.isCurrentJob && (
              <Badge variant="success" className="shrink-0">Aktuell</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{dateRange}</p>
          {position.location && (
            <p className="text-xs text-muted-foreground">{position.location}</p>
          )}
          {position.tasks.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {position.tasks.slice(0, 2).join(" · ")}
              {position.tasks.length > 2 && ` (+${position.tasks.length - 2} weitere)`}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(position.id)}
            aria-label="Position bearbeiten"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(position.id)}
            aria-label="Position löschen"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Gap Warning ──────────────────────────────────────────
function GapWarning({
  gap,
  onExplain,
}: {
  gap: GapInfo;
  onExplain: (gapKey: string, type: GapInfo["explanationType"], text?: string) => void;
}) {
  const [showExplain, setShowExplain] = useState(false);
  const [selectedType, setSelectedType] = useState<GapInfo["explanationType"]>(
    gap.explanationType
  );
  const [customText, setCustomText] = useState(gap.explanation ?? "");
  const gapKey = `${gap.afterPositionId}-${gap.beforePositionId}`;
  const isExplained = !!gap.explanationType;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mx-4"
    >
      <div
        className={`rounded-lg border-2 border-dashed p-3 text-sm ${
          isExplained
            ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950"
            : "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950"
        }`}
      >
        <div className="flex items-center gap-2">
          {isExplained ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className={isExplained ? "text-emerald-800 dark:text-emerald-200" : "text-amber-800 dark:text-amber-200"}>
            Lücke: {formatGapDuration(gap.months)} ({formatYearMonth(gap.startDate)} — {formatYearMonth(gap.endDate)})
          </span>
          {isExplained && gap.explanationType && (
            <Badge variant="success" className="ml-auto">{gap.explanationType}</Badge>
          )}
          {!isExplained && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto text-amber-700 hover:text-amber-900"
              onClick={() => setShowExplain(!showExplain)}
            >
              Erklären
            </Button>
          )}
        </div>

        {showExplain && !isExplained && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              {GAP_EXPLANATION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSelectedType(preset)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedType === preset
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent border-input"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            {selectedType === "Sonstiges" && (
              <Input
                placeholder="Eigene Erklärung eingeben..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="text-sm"
              />
            )}
            <Button
              type="button"
              size="sm"
              disabled={!selectedType}
              onClick={() => {
                if (selectedType) {
                  onExplain(
                    gapKey,
                    selectedType,
                    selectedType === "Sonstiges" ? customText : undefined
                  );
                  setShowExplain(false);
                }
              }}
            >
              Speichern
            </Button>
          </div>
        )}

        {isExplained && gap.explanation && (
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{gap.explanation}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Month/Year Select Helpers ────────────────────────────
const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// ─── Main Component ───────────────────────────────────────
export default function Step2WorkExperience() {
  const t = useTranslations("step2");
  const tc = useTranslations("common");
  const router = useRouter();
  const {
    workExperience,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    reorderWorkExperience,
    lastSaved,
  } = useApplicationStore();

  // View state: null = list view, "new" = add form, string = edit id
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lastSavedText, setLastSavedText] = useState("");
  const [gapExplanations, setGapExplanations] = useState<
    Record<string, { type: GapInfo["explanationType"]; text?: string }>
  >({});

  // ─── DnD sensors ──────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ─── Last saved updater ───────────────────────────────
  useEffect(() => {
    const update = () => setLastSavedText(formatRelativeTime(lastSaved));
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  // ─── Unsaved changes (beforeunload) ───────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (editingId !== null) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [editingId]);

  // ─── Gap detection ────────────────────────────────────
  const gaps = useMemo(() => {
    const detected = detectGaps(workExperience);
    return detected.map((gap) => {
      const key = `${gap.afterPositionId}-${gap.beforePositionId}`;
      const explanation = gapExplanations[key];
      if (explanation) {
        return { ...gap, explanationType: explanation.type, explanation: explanation.text };
      }
      return gap;
    });
  }, [workExperience, gapExplanations]);

  // ─── Gap explanation handler ──────────────────────────
  const handleExplainGap = useCallback(
    (gapKey: string, type: GapInfo["explanationType"], text?: string) => {
      setGapExplanations((prev) => ({ ...prev, [gapKey]: { type, text } }));
      toast.success(tc("success"));
    },
    []
  );

  // ─── DnD handler ──────────────────────────────────────
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = workExperience.findIndex((p) => p.id === active.id);
        const newIndex = workExperience.findIndex((p) => p.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderWorkExperience(oldIndex, newIndex);
          toast.success(tc("success"));
        }
      }
    },
    [workExperience, reorderWorkExperience]
  );

  // ─── Delete handler ───────────────────────────────────
  const handleDelete = useCallback(
    (id: string) => {
      removeWorkExperience(id);
      setDeleteId(null);
      toast.success(tc("success"));
    },
    [removeWorkExperience]
  );

  // ─── Save handler (called from form) ──────────────────
  const handleSave = useCallback(
    (data: WorkExperienceFormData, id?: string) => {
      const tasks = data.tasks
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);
      const achievements = data.achievements
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean);

      if (id && id !== "new") {
        updateWorkExperience(id, {
          company: data.company,
          jobTitle: data.jobTitle,
          startDate: data.startDate,
          endDate: data.isCurrentJob ? undefined : (data.endDate || undefined),
          isCurrentJob: data.isCurrentJob,
          location: data.location || undefined,
          tasks,
          achievements,
          description: data.description || undefined,
        });
        toast.success(tc("success"));
      } else {
        const newEntry: WorkExperience = {
          id: crypto.randomUUID(),
          company: data.company,
          jobTitle: data.jobTitle,
          startDate: data.startDate,
          endDate: data.isCurrentJob ? undefined : (data.endDate || undefined),
          isCurrentJob: data.isCurrentJob,
          location: data.location || undefined,
          tasks,
          achievements,
          description: data.description || undefined,
        };
        addWorkExperience(newEntry);
        toast.success(tc("success"));
      }
      setEditingId(null);
    },
    [addWorkExperience, updateWorkExperience]
  );

  // ─── Find the position being edited ───────────────────
  const editingPosition =
    editingId && editingId !== "new"
      ? workExperience.find((p) => p.id === editingId)
      : undefined;

  // ─── Build gap map: afterPositionId → GapInfo ─────────
  const gapAfterMap = useMemo(() => {
    const map = new Map<string, GapInfo>();
    for (const gap of gaps) {
      map.set(gap.afterPositionId, gap);
    }
    return map;
  }, [gaps]);

  // ─── Current smart tip (rotate) ──────────────────────
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % smartTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const currentTip = smartTips[tipIndex];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ─── Progress Bar ─────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Schritt 2 von 9: {t("title")}</span>
          <span className="text-sm text-muted-foreground">22%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[22%] transition-all duration-300" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* ─── Sidebar ──────────────────────────────── */}
        <Card className="p-6 h-fit sticky top-6 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{currentTip.title}</h3>
              <p className="text-sm text-muted-foreground">{currentTip.tip}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {[
              "100% lokal gespeichert",
              "Keine Server-Übertragung",
              "Jederzeit löschbar",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Positions counter */}
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-1">
              {workExperience.length} Position{workExperience.length !== 1 ? "en" : ""} erfasst
            </p>
            {gaps.length > 0 && (
              <p className="text-xs text-amber-600">
                {gaps.filter((g) => !g.explanationType).length} ungeklärte Lücke(n)
              </p>
            )}
          </div>

          {/* Last saved + online status */}
          <div className="border-t pt-3 flex items-center justify-between gap-2">
            {lastSaved ? (
              <p className="text-xs text-muted-foreground">
                {tc("saved")}: {lastSavedText}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{tc("save")}</p>
            )}
            <OnlineStatus />
          </div>
        </Card>

        {/* ─── Main Content ─────────────────────────── */}
        <div className="space-y-6">
          {editingId !== null ? (
            /* ─── Form View ────────────────────────── */
            <WorkExperienceForm
              position={editingPosition}
              editingId={editingId}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            /* ─── List View ────────────────────────── */
            <>
              {workExperience.length === 0 ? (
                <Card className="p-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t("noEntries")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Fügen Sie Ihre bisherigen Positionen hinzu, um Ihren Lebenslauf zu vervollständigen.
                  </p>
                  <Button onClick={() => setEditingId("new")} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t("addEntry")}
                  </Button>
                </Card>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={workExperience.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {workExperience.map((position) => (
                          <div key={position.id}>
                            <SortablePositionCard
                              position={position}
                              onEdit={(id) => setEditingId(id)}
                              onDelete={(id) => setDeleteId(id)}
                            />
                            {/* Gap warning after this position */}
                            {gapAfterMap.has(position.id) && (
                              <div className="my-2">
                                <GapWarning
                                  gap={gapAfterMap.get(position.id)!}
                                  onExplain={handleExplainGap}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {workExperience.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingId("new")}
                  className="gap-2 w-full"
                >
                  <Plus className="w-4 h-4" />
                  {t("addEntry")}
                </Button>
              )}
            </>
          )}

          {/* ─── Navigation ──────────────────────────── */}
          {editingId === null && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/phases/persoenliche-daten")}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {tc("back")}
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => router.push("/phases/ausbildung")}
                className="gap-2"
              >
                {tc("next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Delete Confirmation Dialog ──────────────── */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Position wird unwiderruflich entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) handleDelete(deleteId);
              }}
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Work Experience Form ──────────────────────────────────
function WorkExperienceForm({
  position,
  editingId,
  onSave,
  onCancel,
}: {
  position?: WorkExperience;
  editingId: string;
  onSave: (data: WorkExperienceFormData, id?: string) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("step2");
  const tc = useTranslations("common");
  const defaultValues: WorkExperienceFormData = position
    ? {
        company: position.company,
        jobTitle: position.jobTitle,
        startDate: position.startDate,
        endDate: position.endDate ?? "",
        isCurrentJob: position.isCurrentJob,
        location: position.location ?? "",
        tasks: position.tasks.join("\n"),
        achievements: position.achievements.join("\n"),
        description: position.description ?? "",
      }
    : {
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
        location: "",
        tasks: "",
        achievements: "",
        description: "",
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const isCurrentJob = watch("isCurrentJob");
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");

  // Parse start/end into month + year for the selects
  const startMonth = startDateValue?.slice(5, 7) ?? "";
  const startYear = startDateValue?.slice(0, 4) ?? "";
  const endMonth = endDateValue?.slice(5, 7) ?? "";
  const endYear = endDateValue?.slice(0, 4) ?? "";

  const handleStartMonthChange = (month: string) => {
    const year = startYear || String(currentYear);
    setValue("startDate", `${year}-${month}`, { shouldValidate: true });
  };

  const handleStartYearChange = (year: string) => {
    const month = startMonth || "01";
    setValue("startDate", `${year}-${month}`, { shouldValidate: true });
  };

  const handleEndMonthChange = (month: string) => {
    const year = endYear || String(currentYear);
    setValue("endDate", `${year}-${month}`, { shouldValidate: true });
  };

  const handleEndYearChange = (year: string) => {
    const month = endMonth || "01";
    setValue("endDate", `${year}-${month}`, { shouldValidate: true });
  };

  const onSubmit = (data: WorkExperienceFormData) => {
    onSave(data, editingId);
  };

  const isEditing = editingId !== "new";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-8">
        <h3 className="text-lg font-semibold mb-6">
          {isEditing ? tc("edit") : t("addEntry")}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company & Job Title */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">{t("employer")} *</Label>
              <Input
                id="company"
                {...register("company")}
                placeholder="Acme GmbH"
                className={errors.company ? "border-destructive" : ""}
                autoFocus
              />
              {errors.company && (
                <p className="text-xs text-destructive mt-1">{errors.company.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="jobTitle">{t("position")} *</Label>
              <Input
                id="jobTitle"
                {...register("jobTitle")}
                placeholder="Software Engineer"
                className={errors.jobTitle ? "border-destructive" : ""}
              />
              {errors.jobTitle && (
                <p className="text-xs text-destructive mt-1">{errors.jobTitle.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Berlin"
            />
          </div>

          {/* Start Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Startdatum *</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className={selectClassName}
                  value={startMonth}
                  onChange={(e) => handleStartMonthChange(e.target.value)}
                  aria-label="Startmonat"
                >
                  <option value="">Monat</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <select
                  className={selectClassName}
                  value={startYear}
                  onChange={(e) => handleStartYearChange(e.target.value)}
                  aria-label="Startjahr"
                >
                  <option value="">Jahr</option>
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              {/* Hidden input for react-hook-form */}
              <input type="hidden" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-xs text-destructive mt-1">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date or Current Job */}
            <div>
              <Label>Enddatum {isCurrentJob ? "" : "*"}</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className={selectClassName}
                  value={endMonth}
                  onChange={(e) => handleEndMonthChange(e.target.value)}
                  disabled={isCurrentJob}
                  aria-label="Endmonat"
                >
                  <option value="">Monat</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <select
                  className={selectClassName}
                  value={endYear}
                  onChange={(e) => handleEndYearChange(e.target.value)}
                  disabled={isCurrentJob}
                  aria-label="Endjahr"
                >
                  <option value="">Jahr</option>
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <input type="hidden" {...register("endDate")} />
              {errors.endDate && (
                <p className="text-xs text-destructive mt-1">{errors.endDate.message}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id="isCurrentJob"
                  checked={isCurrentJob}
                  onCheckedChange={(checked) => {
                    setValue("isCurrentJob", checked, { shouldValidate: true });
                    if (checked) {
                      setValue("endDate", "", { shouldValidate: true });
                    }
                  }}
                />
                <Label htmlFor="isCurrentJob" className="text-sm font-normal cursor-pointer">
                  {t("current")}
                </Label>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div>
            <Label htmlFor="tasks">{t("tasks")}</Label>
            <Textarea
              id="tasks"
              {...register("tasks")}
              placeholder={"Backend-Entwicklung mit Node.js\nCode Reviews durchführen\nCI/CD-Pipelines aufsetzen"}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Jede Zeile wird als separate Aufgabe gespeichert
            </p>
          </div>

          {/* Achievements */}
          <div>
            <Label htmlFor="achievements">Erfolge (eine pro Zeile, optional)</Label>
            <Textarea
              id="achievements"
              {...register("achievements")}
              placeholder={"Performance um 40% verbessert\nTeamgröße von 3 auf 8 skaliert"}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tipp: Erfolge quantifizierbar beschreiben (z.B. &quot;+20% Umsatz&quot;)
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Beschreibung (optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Kurze Beschreibung der Position oder des Unternehmens..."
              rows={2}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              {tc("cancel")}
            </Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {tc("save")}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
