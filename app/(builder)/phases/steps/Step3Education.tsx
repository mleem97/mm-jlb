"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  GripVertical,
  Info,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
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

import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  educationFormSchema,
  type EducationFormData,
} from "@/lib/schemas/educationFormSchema";
import { formatYearMonth } from "@/lib/utils/gapDetection";
import type { Education, EducationType } from "@/types/education";

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

const EDUCATION_TYPES: EducationType[] = [
  "Promotion",
  "Master",
  "Bachelor",
  "Ausbildung",
  "Abitur",
  "Mittlere Reife",
  "Hauptschulabschluss",
  "Sonstiges",
];

const TYPE_BADGE_VARIANTS: Record<EducationType, "default" | "secondary" | "outline" | "success" | "warning" | "destructive"> = {
  Promotion: "default",
  Master: "default",
  Bachelor: "default",
  Ausbildung: "success",
  Abitur: "secondary",
  "Mittlere Reife": "secondary",
  Hauptschulabschluss: "secondary",
  Sonstiges: "outline",
};

// ─── Smart-Tip content ────────────────────────────────────
interface SmartTip {
  title: string;
  tip: string;
  conditional?: boolean;
}

function getSmartTips(totalWorkYears: number): SmartTip[] {
  const tips: SmartTip[] = [
    {
      title: "Relevante Schwerpunkte hervorheben",
      tip: "Erwähnen Sie relevante Schwerpunkte und Thesis-Titel, die zur gewünschten Stelle passen.",
    },
    {
      title: "Chronologische Reihenfolge",
      tip: "Ordnen Sie Ihre Abschlüsse vom neuesten zum ältesten — der höchste Abschluss sollte oben stehen.",
    },
    {
      title: "Note angeben",
      tip: "Geben Sie Ihre Abschlussnote an, wenn diese gut ist (z.\u00a0B. 1,7 oder besser).",
    },
  ];

  if (totalWorkYears > 5) {
    tips.push({
      title: "Weniger ist mehr",
      tip: "Bei >5 Jahren Berufserfahrung können Grundschule und niedrigere Abschlüsse weggelassen werden.",
      conditional: true,
    });
  }

  return tips;
}

// ─── Month/Year Select Helpers ────────────────────────────
const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// ─── Sortable Education Card ──────────────────────────────
function SortableEducationCard({
  education,
  onEdit,
  onDelete,
}: {
  education: Education;
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
  } = useSortable({ id: education.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dateRange = education.endDate
    ? `${formatYearMonth(education.startDate)} — ${formatYearMonth(education.endDate)}`
    : `${formatYearMonth(education.startDate)} — Heute`;

  const subtitle = [education.degree, education.fieldOfStudy]
    .filter(Boolean)
    .join(" — ");

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
          aria-label="Abschluss verschieben"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold truncate">{education.institution}</h4>
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
            <Badge variant={TYPE_BADGE_VARIANTS[education.type]} className="shrink-0">
              {education.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{dateRange}</p>
          {education.grade && (
            <p className="text-xs text-muted-foreground">Note: {education.grade}</p>
          )}
          {education.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {education.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(education.id)}
            aria-label="Abschluss bearbeiten"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(education.id)}
            aria-label="Abschluss löschen"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Education Form ───────────────────────────────────────
function EducationForm({
  education,
  editingId,
  onSave,
  onCancel,
}: {
  education?: Education;
  editingId: string;
  onSave: (data: EducationFormData, id?: string) => void;
  onCancel: () => void;
}) {
  const defaultValues: EducationFormData = education
    ? {
        type: education.type,
        institution: education.institution,
        degree: education.degree ?? "",
        fieldOfStudy: education.fieldOfStudy ?? "",
        startDate: education.startDate,
        endDate: education.endDate ?? "",
        grade: education.grade ?? "",
        description: education.description ?? "",
      }
    : {
        type: "Bachelor",
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");

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

  const onSubmit = (data: EducationFormData) => {
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
          {isEditing ? "Abschluss bearbeiten" : "Neuen Abschluss hinzufügen"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Type & Institution */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Abschlusstyp *</Label>
              <select
                id="type"
                className={`${selectClassName} ${errors.type ? "border-destructive" : ""}`}
                {...register("type")}
              >
                {EDUCATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-xs text-destructive mt-1">{errors.type.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="institution">Institution / Hochschule / Schule *</Label>
              <Input
                id="institution"
                {...register("institution")}
                placeholder="Technische Universität München"
                className={errors.institution ? "border-destructive" : ""}
                autoFocus
              />
              {errors.institution && (
                <p className="text-xs text-destructive mt-1">{errors.institution.message}</p>
              )}
            </div>
          </div>

          {/* Degree & Field of Study */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degree">Abschlussbezeichnung</Label>
              <Input
                id="degree"
                {...register("degree")}
                placeholder="Master of Science"
              />
            </div>
            <div>
              <Label htmlFor="fieldOfStudy">Studiengang / Fachrichtung</Label>
              <Input
                id="fieldOfStudy"
                {...register("fieldOfStudy")}
                placeholder="Informatik"
              />
            </div>
          </div>

          {/* Start Date & End Date */}
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
              <input type="hidden" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-xs text-destructive mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <Label>Enddatum</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className={selectClassName}
                  value={endMonth}
                  onChange={(e) => handleEndMonthChange(e.target.value)}
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
            </div>
          </div>

          {/* Grade */}
          <div className="max-w-xs">
            <Label htmlFor="grade">Note</Label>
            <Input
              id="grade"
              {...register("grade")}
              placeholder='z.B. "1,7" oder "gut"'
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Schwerpunkte / Thesis-Titel</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="z.B. Schwerpunkt Machine Learning, Thesis: Optimierung neuronaler Netze"
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Abschluss speichern
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function Step3Education() {
  const router = useRouter();
  const {
    education,
    workExperience,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
    lastSaved,
  } = useApplicationStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lastSavedText, setLastSavedText] = useState("");

  // ─── Calculate total work experience years ────────────
  const totalWorkYears = useMemo(() => {
    let totalMonths = 0;
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    for (const exp of workExperience) {
      if (!exp.startDate) continue;
      const end = exp.isCurrentJob ? currentYM : (exp.endDate ?? currentYM);
      const [sy, sm] = exp.startDate.split("-").map(Number);
      const [ey, em] = end.split("-").map(Number);
      totalMonths += (ey - sy) * 12 + (em - sm);
    }

    return Math.floor(totalMonths / 12);
  }, [workExperience]);

  const smartTips = useMemo(() => getSmartTips(totalWorkYears), [totalWorkYears]);

  // ─── DnD sensors ──────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
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

  // ─── DnD handler ──────────────────────────────────────
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = education.findIndex((e) => e.id === active.id);
        const newIndex = education.findIndex((e) => e.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderEducation(oldIndex, newIndex);
          toast.success("Reihenfolge aktualisiert");
        }
      }
    },
    [education, reorderEducation],
  );

  // ─── Delete handler ───────────────────────────────────
  const handleDelete = useCallback(
    (id: string) => {
      removeEducation(id);
      setDeleteId(null);
      toast.success("Abschluss entfernt");
    },
    [removeEducation],
  );

  // ─── Save handler ─────────────────────────────────────
  const handleSave = useCallback(
    (data: EducationFormData, id?: string) => {
      if (id && id !== "new") {
        updateEducation(id, {
          type: data.type,
          institution: data.institution,
          degree: data.degree || undefined,
          fieldOfStudy: data.fieldOfStudy || undefined,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          grade: data.grade || undefined,
          description: data.description || undefined,
        });
        toast.success("Abschluss aktualisiert");
      } else {
        const newEntry: Education = {
          id: crypto.randomUUID(),
          type: data.type,
          institution: data.institution,
          degree: data.degree || undefined,
          fieldOfStudy: data.fieldOfStudy || undefined,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          grade: data.grade || undefined,
          description: data.description || undefined,
        };
        addEducation(newEntry);
        toast.success("Abschluss hinzugefügt");
      }
      setEditingId(null);
    },
    [addEducation, updateEducation],
  );

  // ─── Find the entry being edited ──────────────────────
  const editingEntry =
    editingId && editingId !== "new"
      ? education.find((e) => e.id === editingId)
      : undefined;

  // ─── Current smart tip (rotate) ──────────────────────
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % smartTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [smartTips.length]);
  const currentTip = smartTips[tipIndex];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ─── Progress Bar ─────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Schritt 3 von 9: Bildungsweg</span>
          <span className="text-sm text-muted-foreground">33%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[33%] transition-all duration-300" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* ─── Sidebar ──────────────────────────────── */}
        <Card className="p-6 h-fit sticky top-6 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{currentTip?.title}</h3>
              <p className="text-sm text-muted-foreground">{currentTip?.tip}</p>
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

          {/* Education counter */}
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-1">
              {education.length} Abschluss{education.length !== 1 ? "̈e" : ""} erfasst
            </p>
          </div>

          {/* Last saved + online status */}
          <div className="border-t pt-3 flex items-center justify-between gap-2">
            {lastSaved ? (
              <p className="text-xs text-muted-foreground">
                Zuletzt gespeichert: {lastSavedText}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Noch nicht gespeichert</p>
            )}
            <OnlineStatus />
          </div>
        </Card>

        {/* ─── Main Content ─────────────────────────── */}
        <div className="space-y-6">
          {editingId !== null ? (
            <EducationForm
              education={editingEntry}
              editingId={editingId}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              {education.length === 0 ? (
                <Card className="p-12 text-center">
                  <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Noch keine Ausbildung erfasst
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Fügen Sie Ihre Abschlüsse und Ausbildungen hinzu, um Ihren Lebenslauf zu vervollständigen.
                  </p>
                  <Button onClick={() => setEditingId("new")} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ersten Abschluss hinzufügen
                  </Button>
                </Card>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={education.map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {education.map((entry) => (
                          <SortableEducationCard
                            key={entry.id}
                            education={entry}
                            onEdit={(id) => setEditingId(id)}
                            onDelete={(id) => setDeleteId(id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {education.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingId("new")}
                  className="gap-2 w-full"
                >
                  <Plus className="w-4 h-4" />
                  Weiteren Abschluss hinzufügen
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
                onClick={() => router.push("/phases/berufserfahrung")}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Zurück
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => router.push("/phases/skills")}
                className="gap-2"
              >
                Weiter
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
            <AlertDialogTitle>Abschluss löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Abschluss wird unwiderruflich entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) handleDelete(deleteId);
              }}
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
