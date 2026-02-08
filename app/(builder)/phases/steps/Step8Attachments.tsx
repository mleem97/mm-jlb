"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ImageIcon,
  FileIcon,
  GripVertical,
  Lightbulb,
  Trash2,
  Eye,
  Upload,
  X,
  SkipForward,
  List,
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
import { useTranslations } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { applicationDb } from "@/lib/db/applicationDb";
import {
  validateAttachmentFile,
  validateTotalSize,
  getFileTypeCategory,
  MAX_TOTAL_SIZE,
} from "@/lib/schemas/attachmentSchema";
import type { Attachment, AttachmentCategory } from "@/types/attachment";

// ─── Constants ─────────────────────────────────────────────
const CURRENT_STEP = 8;
const TOTAL_STEPS = 9;

const CATEGORY_OPTIONS: { value: AttachmentCategory; key: string }[] = [
  { value: "zeugnis", key: "types.zeugnis" },
  { value: "zertifikat", key: "types.zertifikat" },
  { value: "referenz", key: "types.referenz" },
  { value: "arbeitsprobe", key: "types.arbeitsprobe" },
  { value: "sonstiges", key: "types.sonstiges" },
];

const CATEGORY_KEYS: Record<AttachmentCategory, string> = {
  zeugnis: "types.zeugnis",
  zertifikat: "types.zertifikat",
  referenz: "types.referenz",
  arbeitsprobe: "types.arbeitsprobe",
  sonstiges: "types.sonstiges",
};

const SMART_TIPS = [
  "Arbeitszeugnisse in umgekehrt chronologischer Reihenfolge sortieren",
  "PDF-Dateien bevorzugen — sie werden von ATS-Systemen am besten verarbeitet",
  "Gesamtgröße unter 10 MB halten für E-Mail-Bewerbungen",
];

const ACCEPT_STRING =
  "application/pdf,image/jpeg,image/png,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// ─── Helpers ───────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeIcon(fileType: string) {
  switch (fileType) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "image":
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    default:
      return <FileIcon className="h-5 w-5 text-slate-500" />;
  }
}

// ─── Sortable Attachment Card ──────────────────────────────

function SortableAttachmentCard({
  attachment,
  customTitle,
  onCategoryChange,
  onPreview,
  onDelete,
  onTitleChange,
}: {
  attachment: Attachment;
  customTitle: string;
  onCategoryChange: (id: string, category: AttachmentCategory) => void;
  onPreview: (attachment: Attachment) => void;
  onDelete: (id: string) => void;
  onTitleChange: (id: string, title: string) => void;
}) {
  const t = useTranslations("step8");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: attachment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      <Card className="p-4 flex items-center gap-3 group hover:shadow-md transition-shadow">
        {/* Drag Handle */}
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          {...attributes}
          {...listeners}
          aria-label={t("moveAttachment")}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* File Icon */}
        {fileTypeIcon(attachment.fileType)}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Input
            value={customTitle}
            onChange={(e) => onTitleChange(attachment.id, e.target.value)}
            className="h-7 text-sm font-medium border-transparent hover:border-border focus:border-primary px-1"
            aria-label={t("attachmentTitle")}
          />
          <p className="text-xs text-muted-foreground px-1">
            {formatFileSize(attachment.fileSize)} · {attachment.fileType.toUpperCase()}
          </p>
        </div>

        {/* Category Selector */}
        <select
          value={attachment.category}
          onChange={(e) =>
            onCategoryChange(attachment.id, e.target.value as AttachmentCategory)
          }
          className="text-xs border rounded-md px-2 py-1 bg-background"
          aria-label={t("selectCategory")}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.key)}
            </option>
          ))}
        </select>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onPreview(attachment)}
            aria-label={t("imagePreview")}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(attachment.id)}
            aria-label={t("deleteAttachment")}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────

export default function Step8Attachments() {
  const router = useRouter();
  const t = useTranslations("step8");
  const tc = useTranslations("common");

  const {
    attachments,
    addAttachment,
    updateAttachment,
    removeAttachment,
    reorderAttachments,
    lastSaved,
  } = useApplicationStore();

  // Local state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"pdf" | "image" | null>(null);
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const [indexAsSeparatePage, setIndexAsSeparatePage] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Sync custom titles from attachments
  const derivedTitles = useMemo(() => {
    const next: Record<string, string> = {};
    for (const att of attachments) {
      next[att.id] = att.fileName.replace(/\.[^.]+$/, "");
    }
    return next;
  }, [attachments]);

  // Keep customTitles in sync: for new attachments not yet in customTitles,
  // merge default titles. We use a ref to avoid the eslint set-state-in-effect rule.
  const pendingSync = useMemo(() => {
    const missing: Record<string, string> = {};
    for (const att of attachments) {
      if (!(att.id in customTitles)) {
        missing[att.id] = derivedTitles[att.id];
      }
    }
    return Object.keys(missing).length > 0 ? missing : null;
  }, [attachments, customTitles, derivedTitles]);

  if (pendingSync) {
    setCustomTitles((prev) => ({ ...prev, ...pendingSync }));
  }

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ─── Computed ───────────────────────────────────────────
  const totalSize = useMemo(
    () => attachments.reduce((sum, a) => sum + a.fileSize, 0),
    [attachments],
  );

  const totalSizePercent = useMemo(
    () => Math.min((totalSize / MAX_TOTAL_SIZE) * 100, 100),
    [totalSize],
  );

  const progressPercent = Math.round(
    (CURRENT_STEP / TOTAL_STEPS) * 100,
  );

  // ─── File Processing ─────────────────────────────────────
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        // Validate file
        const fileValidation = validateAttachmentFile(file);
        if (!fileValidation.valid) {
          toast.error(`${file.name}: ${fileValidation.error}`);
          continue;
        }

        // Validate total size
        const sizeValidation = validateTotalSize(attachments, file.size);
        if (!sizeValidation.valid) {
          toast.error(`${file.name}: ${sizeValidation.error}`);
          continue;
        }

        const id = crypto.randomUUID();

        // Show progress
        setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

        try {
          // Simulate progress steps
          setUploadProgress((prev) => ({ ...prev, [id]: 30 }));

          const fileType = getFileTypeCategory(file.type);

          // Save blob to Dexie
          await applicationDb.attachments.put({
            id,
            fileName: file.name,
            fileType,
            fileSize: file.size,
            category: "sonstiges",
            blob: file,
            addedAt: new Date(),
          });

          setUploadProgress((prev) => ({ ...prev, [id]: 70 }));

          // Add metadata to Zustand store
          const attachment: Attachment = {
            id,
            fileName: file.name,
            fileType,
            fileSize: file.size,
            category: "sonstiges",
            addedAt: new Date().toISOString(),
          };
          addAttachment(attachment);

          setUploadProgress((prev) => ({ ...prev, [id]: 100 }));

          // Clean up progress after short delay
          setTimeout(() => {
            setUploadProgress((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          }, 800);

          toast.success(`${file.name} hinzugefügt`);
        } catch {
          toast.error(t("uploadError", { name: file.name }));
          setUploadProgress((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      }
    },
    [attachments, addAttachment],
  );

  // ─── Drop handlers ──────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles],
  );

  // ─── Category change ─────────────────────────────────────
  const handleCategoryChange = useCallback(
    async (id: string, category: AttachmentCategory) => {
      updateAttachment(id, { category });
      await applicationDb.attachments.update(id, { category });
      toast.success(t("categoryUpdated"));
    },
    [updateAttachment],
  );

  // ─── Preview ──────────────────────────────────────────────
  const handlePreview = useCallback(async (attachment: Attachment) => {
    try {
      const record = await applicationDb.attachments.get(attachment.id);
      if (!record?.blob) {
        toast.error(t("fileNotFound"));
        return;
      }

      const url = URL.createObjectURL(record.blob);

      if (attachment.fileType === "pdf") {
        // Open PDF in new tab
        window.open(url, "_blank");
        // Revoke after a delay to allow loading
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else if (attachment.fileType === "image") {
        setPreviewUrl(url);
        setPreviewType("image");
      } else {
        // For doc files, trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = attachment.fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      toast.error(t("previewFailed"));
    }
  }, []);

  const closePreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewType(null);
  }, [previewUrl]);

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = useCallback(
    async (id: string) => {
      removeAttachment(id);
      await applicationDb.attachments.delete(id);
      setDeleteId(null);
      setCustomTitles((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success(t("attachmentRemoved"));
    },
    [removeAttachment],
  );

  // ─── DnD ──────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = attachments.findIndex((a) => a.id === active.id);
        const newIndex = attachments.findIndex((a) => a.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderAttachments(oldIndex, newIndex);
          toast.success(t("orderUpdated"));
        }
      }
    },
    [attachments, reorderAttachments],
  );

  // ─── Title change ────────────────────────────────────────
  const handleTitleChange = useCallback((id: string, title: string) => {
    setCustomTitles((prev) => ({ ...prev, [id]: title }));
  }, []);

  // ─── Navigation ──────────────────────────────────────────
  const handleNext = useCallback(() => {
    router.push("/phases/export");
  }, [router]);

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ─── Progress Bar ─────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {tc("stepOf", { current: CURRENT_STEP, total: TOTAL_STEPS })}: {t("title")}
          </span>
          <span className="text-sm text-muted-foreground">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* ─── Main Content ──────────────────────────── */}
        <div className="space-y-6">
          {/* ─── Upload Zone ──────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t("uploadFiles")}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("uploadHint")}
                </p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
                className={`m-5 p-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <Upload
                  className={`h-10 w-10 mx-auto mb-3 ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
                />
                <p className="font-medium">
                  {t("dragOrClick")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("multipleFiles")}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPT_STRING}
                onChange={handleFileSelect}
                className="hidden"
                aria-label={t("selectFile")}
              />

              {/* Upload progress indicators */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="px-5 pb-5 space-y-2">
                  {Object.entries(uploadProgress).map(([id, progress]) => (
                    <div key={id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{tc("processing")}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.section>

          {/* ─── Attachment List ───────────────────────── */}
          {attachments.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <div className="p-5 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {t("uploadedAttachments", { count: attachments.length })}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {tc("total")}: {formatFileSize(totalSize)} / {formatFileSize(MAX_TOTAL_SIZE)}
                  </div>
                </div>

                {/* Total size progress bar */}
                <div className="px-5 pt-4">
                  <Progress
                    value={totalSizePercent}
                    className={`h-2 ${totalSizePercent > 80 ? "*:data-[slot=indicator]:bg-amber-500" : ""}`}
                  />
                  {totalSizePercent > 80 && (
                    <p className="text-xs text-amber-600 mt-1">
                      {t("sizeWarning")}
                    </p>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={attachments.map((a) => a.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence mode="popLayout">
                        {attachments.map((attachment) => (
                          <SortableAttachmentCard
                            key={attachment.id}
                            attachment={attachment}
                            customTitle={
                              customTitles[attachment.id] ??
                              attachment.fileName.replace(/\.[^.]+$/, "")
                            }
                            onCategoryChange={handleCategoryChange}
                            onPreview={handlePreview}
                            onDelete={(id) => setDeleteId(id)}
                            onTitleChange={handleTitleChange}
                          />
                        ))}
                      </AnimatePresence>
                    </SortableContext>
                  </DndContext>
                </div>
              </Card>
            </motion.section>
          )}

          {/* ─── Anlagenverzeichnis ────────────────────── */}
          {attachments.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <div className="p-5 border-b">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <List className="h-5 w-5" />
                    {t("attachmentIndex")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("attachmentIndexDesc")}
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Toggle */}
                  <div className="flex items-center gap-3">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="indexMode"
                        checked={indexAsSeparatePage}
                        onChange={() => setIndexAsSeparatePage(true)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{t("indexAsSeparatePage")}</span>
                    </Label>
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="indexMode"
                        checked={!indexAsSeparatePage}
                        onChange={() => setIndexAsSeparatePage(false)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{t("indexInCoverLetter")}</span>
                    </Label>
                  </div>

                  {/* Preview */}
                  <Card className="p-4 bg-muted/30 border-dashed">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      {t("imagePreview")}
                    </p>
                    <ol className="space-y-2 list-decimal list-inside">
                      {attachments.map((att) => {
                        const title =
                          customTitles[att.id] ??
                          att.fileName.replace(/\.[^.]+$/, "");
                        return (
                          <li key={att.id} className="text-sm flex items-center gap-2">
                            <span className="flex-1">
                              {title}
                            </span>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {t(CATEGORY_KEYS[att.category])}
                            </Badge>
                            <span className="text-xs text-muted-foreground shrink-0">
                              ({att.fileType.toUpperCase()})
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </Card>
                </div>
              </Card>
            </motion.section>
          )}
        </div>

        {/* ─── Sidebar (Tips) ───────────────────────────── */}
        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-5 space-y-4 border-primary/20">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                {tc("tips")}
              </h3>
              <ul className="space-y-3">
                {[t("tip1"), t("tip2"), t("tip3")].map((tip, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs text-muted-foreground leading-relaxed"
                  >
                    <span className="shrink-0 text-amber-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Save status */}
          {lastSaved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center"
            >
              {tc("lastSaved")}:{" "}
              {lastSaved.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </motion.div>
          )}
        </aside>
      </div>

      {/* ─── Navigation ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 mt-8 border-t"
      >
        <Button asChild variant="outline">
          <Link href="/phases/layout-design">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {tc("back")}
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/phases/export">
              <SkipForward className="h-4 w-4 mr-1" />
              {tc("skip")}
            </Link>
          </Button>
          <Button onClick={handleNext}>
            {tc("next")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </motion.div>

      {/* ─── Delete Confirmation Dialog ─────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Image Preview Modal ───────────────────── */}
      {previewUrl && previewType === "image" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8"
          onClick={closePreview}
          role="dialog"
          aria-label={t("imagePreview")}
        >
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 text-white hover:text-white/80"
            aria-label={tc("close")}
          >
            <X className="h-8 w-8" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={t("imagePreview")}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
