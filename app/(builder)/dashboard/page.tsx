"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Inbox,
  Pencil,
  Trash2,
  StickyNote,
  Filter,
  ArrowUpDown,
  Plus,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { useApplicationStore } from "@/store/applicationStore";
import { calculateStats } from "@/lib/utils/trackerStats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import type { TrackerStatus } from "@/types/exportConfig";

// ─── Status config ────────────────────────────────────
const STATUS_CONFIG: Record<TrackerStatus, { label: string; color: string }> = {
  entwurf: { label: "Entwurf", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  gesendet: { label: "Gesendet", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  antwort: { label: "Antwort", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" },
  absage: { label: "Absage", color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  zusage: { label: "Zusage", color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
};

const ALL_STATUSES: TrackerStatus[] = ["entwurf", "gesendet", "antwort", "absage", "zusage"];

type SortField = "date" | "company";
type SortDirection = "asc" | "desc";

export default function DashboardPage() {
  const router = useRouter();
  const trackerEntries = useApplicationStore((s) => s.trackerEntries);
  const removeTrackerEntry = useApplicationStore((s) => s.removeTrackerEntry);
  const updateTrackerEntry = useApplicationStore((s) => s.updateTrackerEntry);

  const [statusFilter, setStatusFilter] = useState<TrackerStatus | "alle">("alle");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState("");

  const stats = useMemo(() => calculateStats(trackerEntries), [trackerEntries]);

  const filteredAndSorted = useMemo(() => {
    let entries = [...trackerEntries];

    // Filter
    if (statusFilter !== "alle") {
      entries = entries.filter((e) => e.status === statusFilter);
    }

    // Sort
    entries.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      } else {
        cmp = a.companyName.localeCompare(b.companyName, "de");
      }
      return sortDirection === "desc" ? -cmp : cmp;
    });

    return entries;
  }, [trackerEntries, statusFilter, sortField, sortDirection]);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField],
  );

  const handleDelete = useCallback(
    (id: string) => {
      removeTrackerEntry(id);
      toast.success("Bewerbung gelöscht");
    },
    [removeTrackerEntry],
  );

  const handleToggleNote = useCallback(
    (id: string, currentNote: string | undefined) => {
      if (expandedNoteId === id) {
        setExpandedNoteId(null);
      } else {
        setExpandedNoteId(id);
        setEditingNote(currentNote ?? "");
      }
    },
    [expandedNoteId],
  );

  const handleSaveNote = useCallback(
    (id: string) => {
      updateTrackerEntry(id, { notes: editingNote });
      setExpandedNoteId(null);
      toast.success("Notiz gespeichert");
    },
    [editingNote, updateTrackerEntry],
  );

  const handleEdit = useCallback(
    (id: string) => {
      void id;
      router.push("/phases/persoenliche-daten");
    },
    [router],
  );

  const handleNewApplication = useCallback(() => {
    router.push("/intro");
  }, [router]);

  // ─── Empty State ──────────────────────────────────
  if (trackerEntries.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <SiteHeader />
        <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <Inbox className="w-12 h-12 text-muted-foreground" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-2xl font-bold">Noch keine Bewerbungen</h1>
              <p className="text-muted-foreground">
                Erstelle deine erste Bewerbung und sie erscheint hier in deiner Übersicht.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button onClick={handleNewApplication} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Erste Bewerbung starten
              </Button>
            </motion.div>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  // ─── Main Dashboard ───────────────────────────────
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Title */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-1"
          >
            <h1 className="text-2xl font-bold">Bewerbungsübersicht</h1>
            <p className="text-sm text-muted-foreground">
              Alle deine Bewerbungen auf einen Blick
            </p>
          </motion.div>

          {/* ── Statistics Cards ───────────────────── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Briefcase className="h-5 w-5 text-indigo-500" />}
              label="Gesamt"
              value={stats.total}
              delay={0}
            />
            <StatCard
              icon={<FileText className="h-5 w-5 text-blue-500" />}
              label="Offen"
              value={stats.open}
              delay={0.05}
            />
            <StatCard
              icon={<MessageSquare className="h-5 w-5 text-yellow-500" />}
              label="Antworten"
              value={stats.responses}
              delay={0.1}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-green-500" />}
              label="Erfolgsquote"
              value={`${stats.successRate}%`}
              delay={0.15}
            />
          </div>

          {/* ── Filters & Sort ────────────────────── */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as TrackerStatus | "alle")
                }
                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="alle">Alle Status</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-1">
              <Button
                variant={sortField === "date" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => toggleSort("date")}
                className="gap-1 text-xs"
              >
                <ArrowUpDown className="h-3 w-3" />
                Datum
              </Button>
              <Button
                variant={sortField === "company" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => toggleSort("company")}
                className="gap-1 text-xs"
              >
                <ArrowUpDown className="h-3 w-3" />
                Firma
              </Button>
            </div>

            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewApplication}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Neue Bewerbung
              </Button>
            </div>
          </div>

          {/* ── Entry List ────────────────────────── */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map((entry) => {
                const cfg = STATUS_CONFIG[entry.status];
                const isNoteOpen = expandedNoteId === entry.id;

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Company & Job */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className="font-medium truncate">
                            {entry.companyName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {entry.jobTitle}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="text-sm text-muted-foreground shrink-0">
                          {new Date(entry.appliedAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>

                        {/* Status Badge */}
                        <Badge
                          variant="secondary"
                          className={`shrink-0 ${cfg.color}`}
                        >
                          {entry.status === "zusage" && (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          )}
                          {entry.status === "absage" && (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {cfg.label}
                        </Badge>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(entry.id)}
                            className="h-8 w-8 p-0"
                            title="Bearbeiten"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleNote(entry.id, entry.notes)
                            }
                            className={`h-8 w-8 p-0 ${isNoteOpen ? "bg-muted" : ""}`}
                            title="Notiz"
                          >
                            <StickyNote className="h-3.5 w-3.5" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                title="Löschen"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Bewerbung löschen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Die Bewerbung bei{" "}
                                  <strong>{entry.companyName}</strong> wird
                                  unwiderruflich gelöscht.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(entry.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Löschen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Notes Expansion */}
                      <AnimatePresence>
                        {isNoteOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 mt-3 border-t space-y-2">
                              <Textarea
                                value={editingNote}
                                onChange={(e) => setEditingNote(e.target.value)}
                                placeholder="Notiz zur Bewerbung..."
                                rows={3}
                                className="text-sm"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedNoteId(null)}
                                >
                                  Abbrechen
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveNote(entry.id)}
                                >
                                  Speichern
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredAndSorted.length === 0 && trackerEntries.length > 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Keine Bewerbungen mit dem Status &ldquo;
                {statusFilter !== "alle"
                  ? STATUS_CONFIG[statusFilter].label
                  : ""}
                &rdquo; gefunden.
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

// ─── Stat Card ──────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="p-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}
