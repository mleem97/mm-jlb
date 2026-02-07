"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderKanban,
  Info,
  Paperclip,
  Pencil,
  Plus,
  SkipForward,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { useApplicationStore } from "@/store/applicationStore";
import { applicationDb } from "@/lib/db/applicationDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OnlineStatus } from "@/components/ui/online-status";
import { formatRelativeTime } from "@/lib/utils/relativeTime";
import { formatYearMonth } from "@/lib/utils/gapDetection";
import {
  certificateFormSchema,
  projectFormSchema,
  type CertificateFormData,
  type ProjectFormData,
} from "@/lib/schemas/certificateProjectFormSchema";
import type { Certificate } from "@/types/certificate";
import type { Project } from "@/types/project";

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

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// ─── Smart Tips ────────────────────────────────────────────
const SMART_TIPS = [
  {
    title: "Zertifikate zeigen Weiterbildungsbereitschaft",
    tip: "Besonders relevant für die ausgeschriebene Stelle — zeigen Sie, dass Sie am Ball bleiben.",
  },
  {
    title: "Projekte mit messbaren Ergebnissen",
    tip: "Beschreiben Sie Projekte mit konkreten Zahlen und Ergebnissen, z.\u00a0B. \u201EPerformance um 40\u00a0% verbessert\u201C.",
  },
  {
    title: "Technologien als Tags",
    tip: "Technologien als Tags helfen dem ATS-System bei der Zuordnung und erhöhen die Trefferquote.",
  },
];

// ─── Certificate Card ──────────────────────────────────────
function CertificateCard({
  certificate,
  onEdit,
  onDelete,
}: {
  certificate: Certificate;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const dateRange = certificate.expiryDate
    ? `${formatYearMonth(certificate.issueDate)} — ${formatYearMonth(certificate.expiryDate)}`
    : formatYearMonth(certificate.issueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 flex items-start gap-3 group hover:shadow-md transition-shadow">
        <div className="mt-1 text-primary">
          <Award className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold truncate">{certificate.name}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {certificate.issuingOrganization}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{dateRange}</p>
          {certificate.credentialId && (
            <p className="text-xs text-muted-foreground">
              ID: {certificate.credentialId}
            </p>
          )}
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              Nachweis anzeigen
            </a>
          )}
          {certificate.attachmentId && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
              <Paperclip className="w-3 h-3" />
              Datei angehängt
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(certificate.id)}
            aria-label="Zertifikat bearbeiten"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(certificate.id)}
            aria-label="Zertifikat löschen"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Certificate Form ──────────────────────────────────────
function CertificateForm({
  certificate,
  editingId,
  onSave,
  onCancel,
}: {
  certificate?: Certificate;
  editingId: string;
  onSave: (data: CertificateFormData, id?: string, attachmentId?: string) => void;
  onCancel: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentId, setAttachmentId] = useState<string | undefined>(
    certificate?.attachmentId,
  );
  const [attachmentName, setAttachmentName] = useState<string>("");

  const defaultValues: CertificateFormData = certificate
    ? {
        name: certificate.name,
        issuingOrganization: certificate.issuingOrganization,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate ?? "",
        credentialId: certificate.credentialId ?? "",
        credentialUrl: certificate.credentialUrl ?? "",
      }
    : {
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Load existing attachment name
  useEffect(() => {
    if (certificate?.attachmentId) {
      applicationDb.attachments
        .get(certificate.attachmentId)
        .then((att) => {
          if (att) setAttachmentName(att.fileName);
        })
        .catch(() => {});
    }
  }, [certificate?.attachmentId]);

  const issueDateValue = watch("issueDate");
  const expiryDateValue = watch("expiryDate");

  const issueMonth = issueDateValue?.slice(5, 7) ?? "";
  const issueYear = issueDateValue?.slice(0, 4) ?? "";
  const expiryMonth = expiryDateValue?.slice(5, 7) ?? "";
  const expiryYear = expiryDateValue?.slice(0, 4) ?? "";

  const handleIssueMonthChange = (month: string) => {
    const year = issueYear || String(currentYear);
    setValue("issueDate", `${year}-${month}`, { shouldValidate: true });
  };
  const handleIssueYearChange = (year: string) => {
    const month = issueMonth || "01";
    setValue("issueDate", `${year}-${month}`, { shouldValidate: true });
  };
  const handleExpiryMonthChange = (month: string) => {
    const year = expiryYear || String(currentYear);
    setValue("expiryDate", `${year}-${month}`, { shouldValidate: true });
  };
  const handleExpiryYearChange = (year: string) => {
    const month = expiryMonth || "01";
    setValue("expiryDate", `${year}-${month}`, { shouldValidate: true });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      toast.error("Datei ist zu groß (max. 10 MB)");
      return;
    }

    try {
      const id = crypto.randomUUID();
      await applicationDb.attachments.put({
        id,
        fileName: file.name,
        fileType: file.type.startsWith("image/") ? "image" : "pdf",
        fileSize: file.size,
        category: "zertifikat",
        blob: file,
        addedAt: new Date(),
      });
      setAttachmentId(id);
      setAttachmentName(file.name);
      toast.success("Datei angehängt");
    } catch {
      toast.error("Fehler beim Hochladen der Datei");
    }
  };

  const handleRemoveAttachment = async () => {
    if (attachmentId) {
      try {
        await applicationDb.attachments.delete(attachmentId);
      } catch {
        // ignore
      }
      setAttachmentId(undefined);
      setAttachmentName("");
      toast.success("Anhang entfernt");
    }
  };

  const onSubmit = (data: CertificateFormData) => {
    onSave(data, editingId, attachmentId);
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
          {isEditing ? "Zertifikat bearbeiten" : "Neues Zertifikat hinzufügen"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name & Organization */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cert-name">Name des Zertifikats *</Label>
              <Input
                id="cert-name"
                {...register("name")}
                placeholder="AWS Solutions Architect"
                className={errors.name ? "border-destructive" : ""}
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="cert-org">Ausstellende Organisation *</Label>
              <Input
                id="cert-org"
                {...register("issuingOrganization")}
                placeholder="Amazon Web Services"
                className={errors.issuingOrganization ? "border-destructive" : ""}
              />
              {errors.issuingOrganization && (
                <p className="text-xs text-destructive mt-1">
                  {errors.issuingOrganization.message}
                </p>
              )}
            </div>
          </div>

          {/* Issue Date & Expiry Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Ausstellungsdatum *</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className={selectClassName}
                  value={issueMonth}
                  onChange={(e) => handleIssueMonthChange(e.target.value)}
                  aria-label="Ausstellungsmonat"
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
                  value={issueYear}
                  onChange={(e) => handleIssueYearChange(e.target.value)}
                  aria-label="Ausstellungsjahr"
                >
                  <option value="">Jahr</option>
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <input type="hidden" {...register("issueDate")} />
              {errors.issueDate && (
                <p className="text-xs text-destructive mt-1">{errors.issueDate.message}</p>
              )}
            </div>

            <div>
              <Label>Ablaufdatum (optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className={selectClassName}
                  value={expiryMonth}
                  onChange={(e) => handleExpiryMonthChange(e.target.value)}
                  aria-label="Ablaufmonat"
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
                  value={expiryYear}
                  onChange={(e) => handleExpiryYearChange(e.target.value)}
                  aria-label="Ablaufjahr"
                >
                  <option value="">Jahr</option>
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <input type="hidden" {...register("expiryDate")} />
              {errors.expiryDate && (
                <p className="text-xs text-destructive mt-1">{errors.expiryDate.message}</p>
              )}
            </div>
          </div>

          {/* Credential ID & URL */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cert-credentialId">Credential ID (optional)</Label>
              <Input
                id="cert-credentialId"
                {...register("credentialId")}
                placeholder="ABC-123-XYZ"
              />
            </div>
            <div>
              <Label htmlFor="cert-credentialUrl">Credential URL (optional)</Label>
              <Input
                id="cert-credentialUrl"
                {...register("credentialUrl")}
                placeholder="https://verify.example.com/..."
                className={errors.credentialUrl ? "border-destructive" : ""}
              />
              {errors.credentialUrl && (
                <p className="text-xs text-destructive mt-1">
                  {errors.credentialUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label>Zertifikat-Datei anhängen (optional)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.png,.jpeg"
              className="hidden"
              onChange={handleFileUpload}
            />
            {attachmentId && attachmentName ? (
              <div className="flex items-center gap-2 mt-2 p-2 border rounded-md bg-muted/50">
                <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm truncate flex-1">{attachmentName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleRemoveAttachment}
                  aria-label="Anhang entfernen"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="mt-2 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4" />
                Datei auswählen
              </Button>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              PDF, JPG oder PNG (max. 10 MB)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Zertifikat speichern
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

// ─── Project Card ──────────────────────────────────────────
function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const dateRange = project.endDate
    ? `${formatYearMonth(project.startDate)} — ${formatYearMonth(project.endDate)}`
    : `${formatYearMonth(project.startDate)} — Heute`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 flex items-start gap-3 group hover:shadow-md transition-shadow">
        <div className="mt-1 text-primary">
          <FolderKanban className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold truncate">{project.name}</h4>
              {project.role && (
                <p className="text-sm text-muted-foreground truncate">{project.role}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{dateRange}</p>
          {project.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
          {project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              Projekt ansehen
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(project.id)}
            aria-label="Projekt bearbeiten"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project.id)}
            aria-label="Projekt löschen"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Project Form ──────────────────────────────────────────
function ProjectForm({
  project,
  editingId,
  onSave,
  onCancel,
}: {
  project?: Project;
  editingId: string;
  onSave: (data: ProjectFormData, id?: string) => void;
  onCancel: () => void;
}) {
  const defaultValues: ProjectFormData = project
    ? {
        name: project.name,
        description: project.description,
        url: project.url ?? "",
        startDate: project.startDate,
        endDate: project.endDate ?? "",
        technologies: project.technologies.join(", "),
        role: project.role ?? "",
      }
    : {
        name: "",
        description: "",
        url: "",
        startDate: "",
        endDate: "",
        technologies: "",
        role: "",
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const descriptionValue = watch("description") ?? "";
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

  const onSubmit = (data: ProjectFormData) => {
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
          {isEditing ? "Projekt bearbeiten" : "Neues Projekt hinzufügen"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name & Role */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proj-name">Projektname *</Label>
              <Input
                id="proj-name"
                {...register("name")}
                placeholder="E-Commerce Plattform Redesign"
                className={errors.name ? "border-destructive" : ""}
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="proj-role">Rolle (optional)</Label>
              <Input
                id="proj-role"
                {...register("role")}
                placeholder="Lead Developer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="proj-description">Beschreibung *</Label>
            <Textarea
              id="proj-description"
              {...register("description")}
              placeholder="Kurze Beschreibung des Projekts, Ihrer Aufgaben und der erzielten Ergebnisse..."
              rows={4}
              maxLength={500}
              className={errors.description ? "border-destructive" : ""}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              ) : (
                <span />
              )}
              <p
                className={`text-xs ${
                  descriptionValue.length > 450
                    ? descriptionValue.length > 500
                      ? "text-destructive"
                      : "text-amber-500"
                    : "text-muted-foreground"
                }`}
              >
                {descriptionValue.length}/500
              </p>
            </div>
          </div>

          {/* URL */}
          <div>
            <Label htmlFor="proj-url">Projekt-URL (optional)</Label>
            <Input
              id="proj-url"
              {...register("url")}
              placeholder="https://github.com/..."
              className={errors.url ? "border-destructive" : ""}
            />
            {errors.url && (
              <p className="text-xs text-destructive mt-1">{errors.url.message}</p>
            )}
          </div>

          {/* Technologies */}
          <div>
            <Label htmlFor="proj-technologies">Technologien (kommagetrennt)</Label>
            <Input
              id="proj-technologies"
              {...register("technologies")}
              placeholder="React, TypeScript, Node.js, PostgreSQL"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Trennen Sie Technologien durch Kommas
            </p>
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
              <Label>Enddatum (optional)</Label>
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

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Projekt speichern
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function Step5CertificatesProjects() {
  const router = useRouter();
  const {
    certificates,
    projects,
    addCertificate,
    updateCertificate,
    removeCertificate,
    addProject,
    updateProject,
    removeProject,
    addAttachment,
    lastSaved,
  } = useApplicationStore();

  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [deleteCertId, setDeleteCertId] = useState<string | null>(null);
  const [deleteProjId, setDeleteProjId] = useState<string | null>(null);
  const [lastSavedText, setLastSavedText] = useState("");

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
      if (editingCertId !== null || editingProjId !== null) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [editingCertId, editingProjId]);

  // ─── Smart tip rotation ──────────────────────────────
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % SMART_TIPS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const currentTip = SMART_TIPS[tipIndex];

  // ─── Certificate handlers ────────────────────────────
  const handleDeleteCert = useCallback(
    (id: string) => {
      // Also remove the linked attachment from Dexie
      const cert = certificates.find((c) => c.id === id);
      if (cert?.attachmentId) {
        applicationDb.attachments.delete(cert.attachmentId).catch(() => {});
        // Also remove from store attachments if present
        const store = useApplicationStore.getState();
        const att = store.attachments.find((a) => a.id === cert.attachmentId);
        if (att) store.removeAttachment(att.id);
      }
      removeCertificate(id);
      setDeleteCertId(null);
      toast.success("Zertifikat entfernt");
    },
    [certificates, removeCertificate],
  );

  const handleSaveCert = useCallback(
    (data: CertificateFormData, id?: string, attachmentId?: string) => {
      if (id && id !== "new") {
        updateCertificate(id, {
          name: data.name,
          issuingOrganization: data.issuingOrganization,
          issueDate: data.issueDate,
          expiryDate: data.expiryDate || undefined,
          credentialId: data.credentialId || undefined,
          credentialUrl: data.credentialUrl || undefined,
          attachmentId: attachmentId || undefined,
        });
        toast.success("Zertifikat aktualisiert");
      } else {
        const newId = crypto.randomUUID();
        const newEntry: Certificate = {
          id: newId,
          name: data.name,
          issuingOrganization: data.issuingOrganization,
          issueDate: data.issueDate,
          expiryDate: data.expiryDate || undefined,
          credentialId: data.credentialId || undefined,
          credentialUrl: data.credentialUrl || undefined,
          attachmentId: attachmentId || undefined,
        };
        addCertificate(newEntry);

        // Also register the attachment in the store
        if (attachmentId) {
          applicationDb.attachments
            .get(attachmentId)
            .then((att) => {
              if (att) {
                addAttachment({
                  id: att.id,
                  fileName: att.fileName,
                  fileType: att.fileType as "pdf" | "image" | "doc",
                  fileSize: att.fileSize,
                  category: "zertifikat",
                  addedAt: new Date().toISOString(),
                });
              }
            })
            .catch(() => {});
        }

        toast.success("Zertifikat hinzugefügt");
      }
      setEditingCertId(null);
    },
    [addCertificate, updateCertificate, addAttachment],
  );

  // ─── Project handlers ────────────────────────────────
  const handleDeleteProj = useCallback(
    (id: string) => {
      removeProject(id);
      setDeleteProjId(null);
      toast.success("Projekt entfernt");
    },
    [removeProject],
  );

  const handleSaveProj = useCallback(
    (data: ProjectFormData, id?: string) => {
      const technologies = (data.technologies ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (id && id !== "new") {
        updateProject(id, {
          name: data.name,
          description: data.description,
          url: data.url || undefined,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          technologies,
          role: data.role || undefined,
        });
        toast.success("Projekt aktualisiert");
      } else {
        const newEntry: Project = {
          id: crypto.randomUUID(),
          name: data.name,
          description: data.description,
          url: data.url || undefined,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          technologies,
          role: data.role || undefined,
        };
        addProject(newEntry);
        toast.success("Projekt hinzugefügt");
      }
      setEditingProjId(null);
    },
    [addProject, updateProject],
  );

  // ─── Find the entry being edited ──────────────────────
  const editingCert =
    editingCertId && editingCertId !== "new"
      ? certificates.find((c) => c.id === editingCertId)
      : undefined;

  const editingProj =
    editingProjId && editingProjId !== "new"
      ? projects.find((p) => p.id === editingProjId)
      : undefined;

  const isEditing = editingCertId !== null || editingProjId !== null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ─── Progress Bar ─────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Schritt 5 von 9: Zertifikate & Projekte
          </span>
          <span className="text-sm text-muted-foreground">56%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[56%] transition-all duration-300" />
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

          {/* Counters */}
          <div className="border-t pt-3 space-y-1">
            <p className="text-sm font-medium">
              {certificates.length} Zertifikat{certificates.length !== 1 ? "e" : ""} erfasst
            </p>
            <p className="text-sm font-medium">
              {projects.length} Projekt{projects.length !== 1 ? "e" : ""} erfasst
            </p>
          </div>

          {/* Optional hint */}
          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground">
              Dieser Schritt ist optional. Sie können ihn überspringen, wenn Sie keine
              Zertifikate oder Projekte hinzufügen möchten.
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
        <div className="space-y-10">
          {/* ═══════════ SECTION 1: Zertifikate ═══════════ */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Zertifikate</h2>
            </div>

            {editingCertId !== null ? (
              <CertificateForm
                certificate={editingCert}
                editingId={editingCertId}
                onSave={handleSaveCert}
                onCancel={() => setEditingCertId(null)}
              />
            ) : (
              <>
                {certificates.length === 0 ? (
                  <Card className="p-10 text-center">
                    <Award className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Noch keine Zertifikate erfasst
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Fügen Sie Zertifikate hinzu, um Ihre Weiterbildungen zu dokumentieren.
                    </p>
                    <Button
                      onClick={() => setEditingCertId("new")}
                      className="gap-2"
                      disabled={editingProjId !== null}
                    >
                      <Plus className="w-4 h-4" />
                      Erstes Zertifikat hinzufügen
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {certificates.map((cert) => (
                        <CertificateCard
                          key={cert.id}
                          certificate={cert}
                          onEdit={(id) => setEditingCertId(id)}
                          onDelete={(id) => setDeleteCertId(id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {certificates.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingCertId("new")}
                    className="gap-2 w-full mt-3"
                    disabled={editingProjId !== null}
                  >
                    <Plus className="w-4 h-4" />
                    Weiteres Zertifikat hinzufügen
                  </Button>
                )}
              </>
            )}
          </section>

          {/* ═══════════ SECTION 2: Projekte ═══════════ */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FolderKanban className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Projekte & Portfolio</h2>
            </div>

            {editingProjId !== null ? (
              <ProjectForm
                project={editingProj}
                editingId={editingProjId}
                onSave={handleSaveProj}
                onCancel={() => setEditingProjId(null)}
              />
            ) : (
              <>
                {projects.length === 0 ? (
                  <Card className="p-10 text-center">
                    <FolderKanban className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Noch keine Projekte erfasst
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Fügen Sie relevante Projekte hinzu, um Ihre praktische Erfahrung zu
                      zeigen.
                    </p>
                    <Button
                      onClick={() => setEditingProjId("new")}
                      className="gap-2"
                      disabled={editingCertId !== null}
                    >
                      <Plus className="w-4 h-4" />
                      Erstes Projekt hinzufügen
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {projects.map((proj) => (
                        <ProjectCard
                          key={proj.id}
                          project={proj}
                          onEdit={(id) => setEditingProjId(id)}
                          onDelete={(id) => setDeleteProjId(id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {projects.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingProjId("new")}
                    className="gap-2 w-full mt-3"
                    disabled={editingCertId !== null}
                  >
                    <Plus className="w-4 h-4" />
                    Weiteres Projekt hinzufügen
                  </Button>
                )}
              </>
            )}
          </section>

          {/* ─── Navigation ──────────────────────────── */}
          {!isEditing && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/phases/skills")}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Zurück
              </Button>

              <div className="flex flex-col md:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/phases/anschreiben")}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Überspringen
                </button>

                <Button
                  type="button"
                  size="lg"
                  onClick={() => router.push("/phases/anschreiben")}
                  className="gap-2"
                >
                  Weiter
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Delete Certificate Dialog ──────────────── */}
      <AlertDialog
        open={deleteCertId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCertId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zertifikat löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Das Zertifikat und ein
              eventuell angehängter Nachweis werden unwiderruflich entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteCertId) handleDeleteCert(deleteCertId);
              }}
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Delete Project Dialog ──────────────────── */}
      <AlertDialog
        open={deleteProjId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteProjId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Projekt löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Das Projekt wird
              unwiderruflich entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteProjId) handleDeleteProj(deleteProjId);
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
