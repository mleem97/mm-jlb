"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Globe,
  Info,
  Lightbulb,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  getSkillSuggestions,
  languageSuggestions,
  softSkillSuggestions,
  skillCategoryDescriptions,
} from "@/lib/data/skillSuggestions";
import type { Skill, SkillCategory, SkillLevel, LanguageLevel } from "@/types/skills";

// ─── Constants ─────────────────────────────────────────────
const LANGUAGE_LEVELS: LanguageLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Muttersprache",
];

const LANGUAGE_LEVEL_LABELS: Record<LanguageLevel, string> = {
  A1: "A1 – Anfänger",
  A2: "A2 – Grundlegende Kenntnisse",
  B1: "B1 – Fortgeschrittene Sprachverwendung",
  B2: "B2 – Selbstständige Sprachverwendung",
  C1: "C1 – Fachkundige Sprachkenntnisse",
  C2: "C2 – Annähernd muttersprachlich",
  Muttersprache: "Muttersprache",
};

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  hard: "Hard Skills",
  digital: "Digitale Skills",
  green: "Green Skills",
  soft: "Soft Skills",
};

const CATEGORY_ICONS: Record<SkillCategory, string> = {
  hard: "🔧",
  digital: "💻",
  green: "🌱",
  soft: "🤝",
};

const MAX_SOFT_SKILLS = 8;

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// ─── Smart Tips ───────────────────────────────────────────
const SMART_TIPS = [
  {
    title: "Skills an Stelle anpassen",
    tip: "Passen Sie Ihre Skills an die Stellenausschreibung an — verwenden Sie die gleichen Begriffe.",
  },
  {
    title: "Expertise quantifizieren",
    tip: 'Quantifizieren Sie Expertise — z.\u00a0B. "5 Jahre Python-Erfahrung" oder "SAP-Zertifizierung".',
  },
  {
    title: "Soft Skills fokussieren",
    tip: "Max 8 Soft Skills empfohlen — wählen Sie die relevantesten für die Zielposition.",
  },
];

// ─── Star Rating Component ────────────────────────────────
function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: SkillLevel;
  onChange?: (level: SkillLevel) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-0.5">
      {([1, 2, 3, 4, 5] as SkillLevel[]).map((level) => (
        <button
          key={level}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(level)}
          className={`p-0.5 ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          aria-label={`${level} von 5 Sternen`}
        >
          <Star
            className={`w-4 h-4 ${
              level <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Autocomplete Input Component ─────────────────────────
function AutocompleteInput({
  suggestions,
  existingNames,
  onAdd,
  placeholder,
}: {
  suggestions: string[];
  existingNames: string[];
  onAdd: (name: string) => void;
  placeholder: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const lower = inputValue.toLowerCase();
    return suggestions.filter(
      (s) =>
        s.toLowerCase().includes(lower) &&
        !existingNames.some((e) => e.toLowerCase() === s.toLowerCase()),
    );
  }, [inputValue, suggestions, existingNames]);

  const handleAdd = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      if (existingNames.some((e) => e.toLowerCase() === trimmed.toLowerCase())) {
        toast.error("Dieser Skill ist bereits vorhanden");
        return;
      }
      onAdd(trimmed);
      setInputValue("");
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    [existingNames, onAdd],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          handleAdd(filteredSuggestions[highlightedIndex]);
        } else if (inputValue.trim()) {
          handleAdd(inputValue);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [filteredSuggestions, highlightedIndex, inputValue, handleAdd],
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (inputValue.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => handleAdd(inputValue)}
          disabled={!inputValue.trim()}
          className="gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Hinzufügen
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, idx) => (
              <button
                key={suggestion}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${
                  idx === highlightedIndex ? "bg-accent" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAdd(suggestion);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skill Category Description Component ────────────────
function SkillCategoryDescription({ category }: { category: SkillCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const info = skillCategoryDescriptions.find((d) => d.category === category);
  if (!info) return null;

  return (
    <div className="rounded-lg border border-muted bg-muted/30 p-4 space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left group"
      >
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Was sind {info.title}?
        </span>
        <ChevronRight
          className={`w-4 h-4 ml-auto text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {info.description}
              </p>
              <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 p-3">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                  💡 Wie finde ich meine {info.title.split(" (")[0]}?
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                  {info.howToIdentify}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skill Section Component ──────────────────────────────
function SkillSection({
  category,
  infoText,
}: {
  category: SkillCategory;
  infoText?: string;
}) {
  const { skills, addSkill, updateSkill, removeSkill } = useApplicationStore();

  const categorySkills = useMemo(
    () => skills.filter((s) => s.category === category),
    [skills, category],
  );

  const suggestions = useMemo(() => getSkillSuggestions(category), [category]);
  const existingNames = useMemo(() => categorySkills.map((s) => s.name), [categorySkills]);

  const handleAdd = useCallback(
    (name: string) => {
      const newSkill: Skill = {
        id: crypto.randomUUID(),
        name,
        category,
        level: 3 as SkillLevel,
      };
      addSkill(newSkill);
      toast.success(`${name} hinzugefügt`);
    },
    [category, addSkill],
  );

  const handleLevelChange = useCallback(
    (id: string, level: SkillLevel) => {
      updateSkill(id, { level });
    },
    [updateSkill],
  );

  const handleRemove = useCallback(
    (id: string, name: string) => {
      removeSkill(id);
      toast.success(`${name} entfernt`);
    },
    [removeSkill],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{CATEGORY_ICONS[category]}</span>
        <h3 className="font-semibold text-base">{CATEGORY_LABELS[category]}</h3>
        {categorySkills.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {categorySkills.length}
          </Badge>
        )}
      </div>

      <SkillCategoryDescription category={category} />

      {infoText && (
        <div className="flex items-start gap-2 rounded-md bg-sky-50 dark:bg-sky-950/30 p-3 text-sm text-sky-700 dark:text-sky-300">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{infoText}</span>
        </div>
      )}

      <AutocompleteInput
        suggestions={suggestions}
        existingNames={existingNames}
        onAdd={handleAdd}
        placeholder={`${CATEGORY_LABELS[category]} eingeben...`}
      />

      {categorySkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {categorySkills.map((skill) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm"
              >
                <span className="text-sm font-medium">{skill.name}</span>
                <StarRating
                  value={skill.level}
                  onChange={(level) => handleLevelChange(skill.id, level)}
                />
                <button
                  type="button"
                  onClick={() => handleRemove(skill.id, skill.name)}
                  className="ml-1 p-0.5 rounded-full hover:bg-destructive/10 transition-colors"
                  aria-label={`${skill.name} entfernen`}
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── Soft Skills Section Component ────────────────────────
function SoftSkillsSection() {
  const { skills, addSkill, removeSkill } = useApplicationStore();
  const [customInput, setCustomInput] = useState("");

  const softSkills = useMemo(
    () => skills.filter((s) => s.category === "soft"),
    [skills],
  );

  const isSelected = useCallback(
    (name: string) => softSkills.some((s) => s.name.toLowerCase() === name.toLowerCase()),
    [softSkills],
  );

  const togglePreset = useCallback(
    (name: string) => {
      const existing = softSkills.find(
        (s) => s.name.toLowerCase() === name.toLowerCase(),
      );
      if (existing) {
        removeSkill(existing.id);
        toast.success(`${name} entfernt`);
      } else {
        const newSkill: Skill = {
          id: crypto.randomUUID(),
          name,
          category: "soft",
          level: 3 as SkillLevel,
        };
        addSkill(newSkill);
        toast.success(`${name} hinzugefügt`);
      }
    },
    [softSkills, addSkill, removeSkill],
  );

  const handleAddCustom = useCallback(() => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (isSelected(trimmed)) {
      toast.error("Dieser Soft Skill ist bereits vorhanden");
      return;
    }
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: trimmed,
      category: "soft",
      level: 3 as SkillLevel,
    };
    addSkill(newSkill);
    toast.success(`${trimmed} hinzugefügt`);
    setCustomInput("");
  }, [customInput, isSelected, addSkill]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{CATEGORY_ICONS.soft}</span>
        <h3 className="font-semibold text-base">{CATEGORY_LABELS.soft}</h3>
        <Badge
          variant={softSkills.length > MAX_SOFT_SKILLS ? "warning" : "secondary"}
          className="ml-auto"
        >
          {softSkills.length}
          {softSkills.length > MAX_SOFT_SKILLS && " ⚠"}
        </Badge>
      </div>

      <SkillCategoryDescription category="soft" />

      {softSkills.length > MAX_SOFT_SKILLS && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-700 dark:text-amber-300">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Sie haben mehr als {MAX_SOFT_SKILLS} Soft Skills gewählt. Wir empfehlen max.{" "}
            {MAX_SOFT_SKILLS} — wählen Sie die relevantesten für die Zielposition.
          </span>
        </div>
      )}

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {softSkillSuggestions.map((suggestion) => {
          const selected = isSelected(suggestion.name);
          return (
            <button
              key={suggestion.name}
              type="button"
              onClick={() => togglePreset(suggestion.name)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                selected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-input hover:bg-accent"
              }`}
            >
              {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
              {suggestion.name}
            </button>
          );
        })}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <Input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          placeholder="Eigenen Soft Skill eingeben..."
          className="flex-1"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddCustom}
          disabled={!customInput.trim()}
          className="gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Hinzufügen
        </Button>
      </div>

      {/* Custom soft skills (not from presets) */}
      {softSkills.filter(
        (s) => !softSkillSuggestions.some((p) => p.name.toLowerCase() === s.name.toLowerCase()),
      ).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {softSkills
            .filter(
              (s) =>
                !softSkillSuggestions.some(
                  (p) => p.name.toLowerCase() === s.name.toLowerCase(),
                ),
            )
            .map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className="gap-1 pr-1 cursor-default"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => {
                    removeSkill(skill.id);
                    toast.success(`${skill.name} entfernt`);
                  }}
                  className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/10"
                  aria-label={`${skill.name} entfernen`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Language Section Component ───────────────────────────
function LanguageSection() {
  const { languages, addLanguage, updateLanguage, removeLanguage } =
    useApplicationStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel>("B1");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const existingNames = useMemo(
    () => languages.map((l) => l.name.toLowerCase()),
    [languages],
  );

  const availableLanguages = useMemo(
    () =>
      languageSuggestions.filter(
        (l) =>
          !existingNames.includes(l.toLowerCase()) ||
          (editingId !== null &&
            languages.find((lang) => lang.id === editingId)?.name.toLowerCase() ===
              l.toLowerCase()),
      ),
    [existingNames, editingId, languages],
  );

  const handleAdd = useCallback(() => {
    if (!selectedLanguage) {
      toast.error("Bitte wählen Sie eine Sprache aus");
      return;
    }

    if (editingId) {
      updateLanguage(editingId, { name: selectedLanguage, level: selectedLevel });
      toast.success(`${selectedLanguage} aktualisiert`);
      setEditingId(null);
    } else {
      if (existingNames.includes(selectedLanguage.toLowerCase())) {
        toast.error("Diese Sprache ist bereits vorhanden");
        return;
      }
      addLanguage({
        id: crypto.randomUUID(),
        name: selectedLanguage,
        level: selectedLevel,
      });
      toast.success(`${selectedLanguage} hinzugefügt`);
    }

    setSelectedLanguage("");
    setSelectedLevel("B1");
    setShowForm(false);
  }, [
    selectedLanguage,
    selectedLevel,
    editingId,
    existingNames,
    addLanguage,
    updateLanguage,
  ]);

  const handleEdit = useCallback(
    (id: string) => {
      const lang = languages.find((l) => l.id === id);
      if (!lang) return;
      setSelectedLanguage(lang.name);
      setSelectedLevel(lang.level);
      setEditingId(id);
      setShowForm(true);
    },
    [languages],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const lang = languages.find((l) => l.id === id);
      removeLanguage(id);
      setDeleteId(null);
      if (lang) toast.success(`${lang.name} entfernt`);
    },
    [languages, removeLanguage],
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setSelectedLanguage("");
    setSelectedLevel("B1");
    setEditingId(null);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-sky-500" />
        <h3 className="font-semibold text-base">Sprachen</h3>
        {languages.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {languages.length}
          </Badge>
        )}
      </div>

      {/* GER Level Info */}
      <div className="flex items-start gap-2 rounded-md bg-sky-50 dark:bg-sky-950/30 p-3 text-sm text-sky-700 dark:text-sky-300">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          GER-Stufen: A1–A2 Grundkenntnisse, B1–B2 Selbstständig, C1–C2 Kompetent,
          Muttersprache
        </span>
      </div>

      {/* Language list */}
      {languages.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {languages.map((lang) => (
              <motion.div
                key={lang.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{lang.name}</span>
                  <Badge
                    variant={
                      lang.level === "Muttersprache"
                        ? "success"
                        : lang.level.startsWith("C")
                          ? "default"
                          : lang.level.startsWith("B")
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {lang.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(lang.id)}
                    className="h-8 w-8 p-0"
                    aria-label={`${lang.name} bearbeiten`}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(lang.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    aria-label={`${lang.name} löschen`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="language-select">Sprache</Label>
                  <select
                    id="language-select"
                    className={selectClassName}
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="">Sprache wählen...</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="level-select">Niveau</Label>
                  <select
                    id="level-select"
                    className={selectClassName}
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as LanguageLevel)}
                  >
                    {LANGUAGE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {LANGUAGE_LEVEL_LABELS[level]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  Abbrechen
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAdd}
                  disabled={!selectedLanguage}
                  className="gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingId ? "Aktualisieren" : "Hinzufügen"}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowForm(true)}
          className="gap-2 w-full"
        >
          <Plus className="w-4 h-4" />
          {languages.length === 0 ? "Sprache hinzufügen" : "Weitere Sprache hinzufügen"}
        </Button>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sprache löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Sprache wird unwiderruflich aus Ihrem Profil entfernt.
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

// ─── Main Component ───────────────────────────────────────
export default function Step4Skills() {
  const router = useRouter();
  const { skills, languages, lastSaved } = useApplicationStore();

  const [lastSavedText, setLastSavedText] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

  // ─── Last saved updater ───────────────────────────────
  useEffect(() => {
    const update = () => setLastSavedText(formatRelativeTime(lastSaved));
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  // ─── Rotating tips ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % SMART_TIPS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = SMART_TIPS[tipIndex];

  // ─── Stats ────────────────────────────────────────────
  const skillCount = skills.length;
  const langCount = languages.length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ─── Progress Bar ─────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Schritt 4 von 9: Skills &amp; Kompetenzen
          </span>
          <span className="text-sm text-muted-foreground">44%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[44%] transition-all duration-300" />
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

          {/* Stats */}
          <div className="border-t pt-3 space-y-1">
            <p className="text-sm font-medium">
              {skillCount} Skill{skillCount !== 1 ? "s" : ""} erfasst
            </p>
            <p className="text-sm text-muted-foreground">
              {langCount} Sprache{langCount !== 1 ? "n" : ""} erfasst
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
        <div className="space-y-8">
          {/* Section 1: Hard Skills */}
          <Card className="p-6">
            <SkillSection category="hard" />
          </Card>

          {/* Section 2: Digital Skills */}
          <Card className="p-6">
            <SkillSection
              category="digital"
              infoText="Digitale Kompetenzen sind 2026 besonders gefragt"
            />
          </Card>

          {/* Section 3: Green Skills */}
          <Card className="p-6">
            <SkillSection
              category="green"
              infoText="Green Skills gewinnen an Bedeutung — ESG, Nachhaltigkeit"
            />
          </Card>

          {/* Section 4: Soft Skills */}
          <Card className="p-6">
            <SoftSkillsSection />
          </Card>

          {/* Section 5: Languages */}
          <Card className="p-6">
            <LanguageSection />
          </Card>

          {/* ─── Navigation ──────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/phases/ausbildung")}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => router.push("/phases/zertifikate")}
              className="gap-2"
            >
              Weiter
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
