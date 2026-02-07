"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Lightbulb,
  Eye,
  Palette,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { templates } from "@/lib/data/templates";
import { colorPalettes } from "@/lib/data/colorPalettes";
import type { TemplateId, FontFamily, PhotoPosition, HeaderStyle } from "@/types/layoutConfig";

// ─── Constants ─────────────────────────────────────────────
const TOTAL_STEPS = 9;
const CURRENT_STEP = 7;

const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
];

const PHOTO_POSITION_OPTIONS: { value: PhotoPosition; label: string }[] = [
  { value: "top-right", label: "Oben rechts" },
  { value: "top-left", label: "Oben links" },
  { value: "sidebar", label: "Seitenleiste" },
];

const HEADER_STYLE_OPTIONS: { value: HeaderStyle; label: string }[] = [
  { value: "centered", label: "Zentriert" },
  { value: "left-aligned", label: "Linksbündig" },
  { value: "minimal", label: "Minimal" },
];

const TIPS = [
  "ATS-Systeme bevorzugen schlichte Layouts \u2014 w\u00e4hlen Sie \u201eKlassisch\u201c im Zweifelsfall.",
  "Farben sollten zum Unternehmen passen \u2014 schauen Sie auf die Unternehmens-Website.",
  "Serifenlose Schriften sind am Bildschirm besser lesbar.",
];

// ─── Document Card ─────────────────────────────────────────
interface DocCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  recommended?: boolean;
  onChange: (checked: boolean) => void;
}

function DocCard({ icon, title, description, checked, recommended, onChange }: DocCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors w-full ${
        checked
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/20 bg-card hover:border-muted-foreground/40"
      }`}
    >
      <div
        className={`shrink-0 rounded-lg p-2.5 ${
          checked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{title}</span>
          {recommended && (
            <Badge variant="secondary" className="text-xs">
              empfohlen
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div
        className={`shrink-0 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
          checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
        }`}
      >
        {checked && <Check className="h-3 w-3" />}
      </div>
    </motion.button>
  );
}

// ─── Template Card ─────────────────────────────────────────
interface TemplateCardProps {
  template: (typeof templates)[number];
  selected: boolean;
  onClick: () => void;
}

function TemplateCard({ template, selected, onClick }: TemplateCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col rounded-xl border-2 overflow-hidden text-left transition-colors ${
        selected
          ? "border-primary shadow-lg ring-2 ring-primary/20"
          : "border-muted-foreground/20 hover:border-muted-foreground/40"
      }`}
    >
      {/* Template Preview */}
      <div
        className="h-36 relative"
        style={{ backgroundColor: template.previewColors.bg }}
      >
        {/* Header bar */}
        <div
          className="absolute top-0 left-0 right-0 h-10"
          style={{ backgroundColor: template.previewColors.accent }}
        />
        {/* Content lines */}
        <div className="absolute top-14 left-4 right-4 space-y-2">
          <div
            className="h-2 rounded-full w-3/4"
            style={{ backgroundColor: template.previewColors.accent, opacity: 0.3 }}
          />
          <div
            className="h-2 rounded-full w-1/2"
            style={{ backgroundColor: template.previewColors.text, opacity: 0.15 }}
          />
          <div
            className="h-2 rounded-full w-2/3"
            style={{ backgroundColor: template.previewColors.text, opacity: 0.15 }}
          />
          <div
            className="h-2 rounded-full w-1/3"
            style={{ backgroundColor: template.previewColors.text, opacity: 0.15 }}
          />
        </div>
        {/* Sidebar for modern/creative */}
        {template.id !== "classic" && (
          <div
            className="absolute top-0 right-0 bottom-0 w-10"
            style={{
              backgroundColor: template.previewColors.accent,
              opacity: template.id === "creative" ? 0.9 : 0.7,
            }}
          />
        )}
        {/* Selected badge */}
        {selected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-sm">{template.name}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {template.features.map((f) => (
            <Badge key={f} variant="outline" className="text-[10px] px-1.5 py-0">
              {f}
            </Badge>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Color Palette Button ──────────────────────────────────
interface PaletteButtonProps {
  palette: (typeof colorPalettes)[number];
  active: boolean;
  onClick: () => void;
}

function PaletteButton({ palette, active, onClick }: PaletteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left transition-colors text-xs ${
        active ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-muted-foreground/40"
      }`}
    >
      <div className="flex gap-1">
        <div className="h-5 w-5 rounded" style={{ backgroundColor: palette.primary }} />
        <div className="h-5 w-5 rounded" style={{ backgroundColor: palette.secondary }} />
      </div>
      <span className="font-medium">{palette.name}</span>
    </button>
  );
}

// ─── Live Preview ──────────────────────────────────────────
interface LivePreviewProps {
  zoom: number;
}

function LivePreview({ zoom }: LivePreviewProps) {
  const personalData = useApplicationStore((s) => s.personalData);
  const layoutConfig = useApplicationStore((s) => s.layoutConfig);

  const displayName =
    personalData.firstName || personalData.lastName
      ? `${personalData.firstName} ${personalData.lastName}`.trim()
      : "Max Mustermann";

  const displayAddress =
    personalData.address.city
      ? `${personalData.address.street ? personalData.address.street + ", " : ""}${personalData.address.zip} ${personalData.address.city}`
      : "Musterstraße 1, 12345 Berlin";

  const displayEmail = personalData.email || "max@beispiel.de";
  const displayPhone = personalData.phone || "0170 1234567";

  const isCreative = layoutConfig.templateId === "creative";
  const isModern = layoutConfig.templateId === "modern";
  const hasSidebar = isModern || isCreative;

  const headerIsCenter = layoutConfig.headerStyle === "centered";
  const headerIsMinimal = layoutConfig.headerStyle === "minimal";

  return (
    <div
      className="bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200 origin-top-left"
      style={{
        width: 298,
        height: 421,
        transform: `scale(${zoom / 100})`,
        fontFamily: layoutConfig.fontFamily,
        fontSize: `${(layoutConfig.fontSize / 12) * 7}px`,
      }}
    >
      {/* Main layout */}
      <div className="flex h-full">
        {/* Sidebar */}
        {hasSidebar && (
          <div
            className="flex flex-col items-center pt-4 px-2 gap-2"
            style={{
              width: 72,
              backgroundColor: layoutConfig.primaryColor,
              color: "#fff",
            }}
          >
            {layoutConfig.showPhoto && (
              <div
                className="rounded-full border-2 border-white/40 flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: layoutConfig.secondaryColor,
                }}
              >
                <span className="text-[8px] font-bold" style={{ color: layoutConfig.primaryColor }}>
                  Foto
                </span>
              </div>
            )}
            <div className="mt-2 w-full px-1 space-y-1.5">
              <div className="h-0.75 rounded-full bg-white/60 w-full" />
              <div className="h-0.75 rounded-full bg-white/40 w-4/5" />
              <div className="h-0.75 rounded-full bg-white/40 w-3/5" />
              <div className="mt-2 h-0.75 rounded-full bg-white/60 w-full" />
              <div className="h-0.75 rounded-full bg-white/40 w-4/5" />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div
            className={`px-3 py-2.5 ${headerIsCenter ? "text-center" : ""}`}
            style={{
              backgroundColor: hasSidebar ? "#fff" : layoutConfig.primaryColor,
              color: hasSidebar ? layoutConfig.primaryColor : "#fff",
              borderBottom: hasSidebar ? `2px solid ${layoutConfig.primaryColor}` : "none",
            }}
          >
            <div className="flex items-start justify-between">
              <div className={`${headerIsCenter ? "w-full" : ""}`}>
                <div className={`font-bold ${headerIsMinimal ? "text-[9px]" : "text-[11px]"}`}>
                  {displayName}
                </div>
                {!headerIsMinimal && (
                  <div className="text-[6px] opacity-80 mt-0.5">
                    {displayEmail} · {displayPhone}
                  </div>
                )}
                {!headerIsMinimal && (
                  <div className="text-[5px] opacity-60 mt-0.5">{displayAddress}</div>
                )}
              </div>
              {/* Photo in header (non-sidebar layouts) */}
              {!hasSidebar && layoutConfig.showPhoto && (
                <div
                  className="rounded-sm flex items-center justify-center shrink-0 ml-2"
                  style={{
                    width: 32,
                    height: 40,
                    backgroundColor: layoutConfig.secondaryColor,
                    order: layoutConfig.photoPosition === "top-left" ? -1 : 1,
                  }}
                >
                  <span className="text-[5px] font-bold" style={{ color: layoutConfig.primaryColor }}>
                    Foto
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Body sections */}
          <div className="flex-1 px-3 py-2 space-y-2">
            {/* Section: Berufserfahrung */}
            <div>
              <div
                className="text-[7px] font-bold pb-0.5 mb-1"
                style={{
                  color: layoutConfig.primaryColor,
                  borderBottom: `1px solid ${layoutConfig.primaryColor}40`,
                }}
              >
                Berufserfahrung
              </div>
              <div className="space-y-1">
                <div className="h-0.75 rounded-full bg-gray-200 w-full" />
                <div className="h-0.75 rounded-full bg-gray-200 w-4/5" />
                <div className="h-0.75 rounded-full bg-gray-150 w-3/5" />
              </div>
            </div>

            {/* Section: Ausbildung */}
            <div>
              <div
                className="text-[7px] font-bold pb-0.5 mb-1"
                style={{
                  color: layoutConfig.primaryColor,
                  borderBottom: `1px solid ${layoutConfig.primaryColor}40`,
                }}
              >
                Ausbildung
              </div>
              <div className="space-y-1">
                <div className="h-0.75 rounded-full bg-gray-200 w-full" />
                <div className="h-0.75 rounded-full bg-gray-200 w-3/4" />
              </div>
            </div>

            {/* Section: Skills */}
            <div>
              <div
                className="text-[7px] font-bold pb-0.5 mb-1"
                style={{
                  color: layoutConfig.primaryColor,
                  borderBottom: `1px solid ${layoutConfig.primaryColor}40`,
                }}
              >
                Kenntnisse
              </div>
              <div className="flex gap-1 flex-wrap">
                {["Skill 1", "Skill 2", "Skill 3"].map((s) => (
                  <div
                    key={s}
                    className="text-[5px] rounded px-1 py-0.5"
                    style={{
                      backgroundColor: layoutConfig.secondaryColor,
                      color: layoutConfig.primaryColor,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function Step7Layout() {
  const router = useRouter();

  // Store
  const documentSelection = useApplicationStore((s) => s.documentSelection);
  const layoutConfig = useApplicationStore((s) => s.layoutConfig);
  const setDocumentSelection = useApplicationStore((s) => s.setDocumentSelection);
  const setLayoutConfig = useApplicationStore((s) => s.setLayoutConfig);
  const lastSaved = useApplicationStore((s) => s.lastSaved);

  // Local state
  const [zoom, setZoom] = useState(100);

  const progress = useMemo(
    () => Math.min(Math.max(Math.round((CURRENT_STEP / TOTAL_STEPS) * 100), 0), 100),
    [],
  );

  // ─── Handlers ──────────────────────────────────────────
  const handleTemplateSelect = useCallback(
    (id: TemplateId) => {
      const tpl = templates.find((t) => t.id === id);
      if (tpl) {
        setLayoutConfig({
          templateId: id,
          primaryColor: tpl.previewColors.accent,
          secondaryColor: tpl.previewColors.bg,
        });
      }
    },
    [setLayoutConfig],
  );

  const handlePaletteSelect = useCallback(
    (palette: (typeof colorPalettes)[number]) => {
      setLayoutConfig({
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
      });
    },
    [setLayoutConfig],
  );

  const handleNext = useCallback(() => {
    router.push("/phases/anlagen");
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ─── Progress ─────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Schritt {CURRENT_STEP} von {TOTAL_STEPS}: Layout & Design
          </span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
        {/* ─── Left Column ──────────────────────────────── */}
        <div className="space-y-8">
          {/* ── 7.1 Document Selection ────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Dokument-Auswahl
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DocCard
                icon={<FileText className="h-5 w-5" />}
                title="Anschreiben"
                description="Individuelles Bewerbungsanschreiben"
                checked={documentSelection.includeCoverLetter}
                recommended
                onChange={(checked) => setDocumentSelection({ includeCoverLetter: checked })}
              />
              <DocCard
                icon={<BookOpen className="h-5 w-5" />}
                title="Lebenslauf"
                description="Tabellarischer Lebenslauf mit allen Stationen"
                checked={documentSelection.includeCV}
                recommended
                onChange={(checked) => setDocumentSelection({ includeCV: checked })}
              />
              <DocCard
                icon={<ImageIcon className="h-5 w-5" />}
                title="Deckblatt"
                description="Optionales Deckblatt mit Foto und Kurzprofil"
                checked={documentSelection.includeCoverPage}
                onChange={(checked) => setDocumentSelection({ includeCoverPage: checked })}
              />
            </div>
          </motion.section>

          {/* ── 7.2 Template Selection ────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Vorlage auswählen
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  selected={layoutConfig.templateId === tpl.id}
                  onClick={() => handleTemplateSelect(tpl.id)}
                />
              ))}
            </div>
          </motion.section>

          {/* ── 7.3 Design Customization ──────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Design-Anpassung
            </h2>
            <Card className="p-6 space-y-6">
              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Farben</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primärfarbe</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="primaryColor"
                        type="color"
                        value={layoutConfig.primaryColor}
                        onChange={(e) => setLayoutConfig({ primaryColor: e.target.value })}
                        className="h-9 w-14 rounded border border-input cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {layoutConfig.primaryColor}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Sekundärfarbe</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="secondaryColor"
                        type="color"
                        value={layoutConfig.secondaryColor}
                        onChange={(e) => setLayoutConfig({ secondaryColor: e.target.value })}
                        className="h-9 w-14 rounded border border-input cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {layoutConfig.secondaryColor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Palette presets */}
                <div>
                  <Label className="mb-2 block">Farbpaletten</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorPalettes.map((palette) => (
                      <PaletteButton
                        key={palette.name}
                        palette={palette}
                        active={
                          layoutConfig.primaryColor === palette.primary &&
                          layoutConfig.secondaryColor === palette.secondary
                        }
                        onClick={() => handlePaletteSelect(palette)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-semibold">Typografie</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Schriftart</Label>
                    <select
                      id="fontFamily"
                      value={layoutConfig.fontFamily}
                      onChange={(e) => setLayoutConfig({ fontFamily: e.target.value as FontFamily })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">
                      Schriftgröße: <span className="font-mono">{layoutConfig.fontSize}pt</span>
                    </Label>
                    <input
                      id="fontSize"
                      type="range"
                      min={10}
                      max={14}
                      step={1}
                      value={layoutConfig.fontSize}
                      onChange={(e) => setLayoutConfig({ fontSize: Number(e.target.value) })}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>10pt</span>
                      <span>14pt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header & Photo */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-semibold">Kopfzeile & Foto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerStyle">Kopfzeilen-Stil</Label>
                    <select
                      id="headerStyle"
                      value={layoutConfig.headerStyle}
                      onChange={(e) =>
                        setLayoutConfig({ headerStyle: e.target.value as HeaderStyle })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {HEADER_STYLE_OPTIONS.map((h) => (
                        <option key={h.value} value={h.value}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photoPosition">Foto-Position</Label>
                    <select
                      id="photoPosition"
                      value={layoutConfig.photoPosition}
                      onChange={(e) =>
                        setLayoutConfig({ photoPosition: e.target.value as PhotoPosition })
                      }
                      disabled={!layoutConfig.showPhoto}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {PHOTO_POSITION_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="showPhoto"
                    checked={layoutConfig.showPhoto}
                    onCheckedChange={(checked) => setLayoutConfig({ showPhoto: checked })}
                  />
                  <Label htmlFor="showPhoto" className="cursor-pointer">
                    Foto im Lebenslauf anzeigen
                  </Label>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* ── 7.4 Live Preview ──────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Vorschau
            </h2>
            <Card className="p-6">
              {/* Zoom controls */}
              <div className="flex items-center gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(75)}
                  className={zoom === 75 ? "ring-2 ring-primary" : ""}
                >
                  <ZoomOut className="h-3 w-3 mr-1" />
                  75%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(100)}
                  className={zoom === 100 ? "ring-2 ring-primary" : ""}
                >
                  100%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(125)}
                  className={zoom === 125 ? "ring-2 ring-primary" : ""}
                >
                  <ZoomIn className="h-3 w-3 mr-1" />
                  125%
                </Button>
              </div>

              {/* Preview container */}
              <div
                className="overflow-auto bg-muted/30 rounded-lg p-6 flex justify-center"
                style={{
                  minHeight: 300,
                  maxHeight: 600,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${layoutConfig.templateId}-${layoutConfig.primaryColor}-${layoutConfig.fontFamily}-${layoutConfig.showPhoto}-${layoutConfig.headerStyle}-${zoom}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LivePreview zoom={zoom} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Diese Vorschau zeigt die ungefähre Darstellung. Das finale PDF kann leicht abweichen.
              </p>
            </Card>
          </motion.section>
        </div>

        {/* ─── Right Column (Tips) ──────────────────────── */}
        <aside className="space-y-6">
          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-5 space-y-4 border-primary/20">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Tipps
              </h3>
              <ul className="space-y-3">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
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
              Zuletzt gespeichert:{" "}
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
          <Link href="/phases/anschreiben">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </Link>
        </Button>
        <Button onClick={handleNext}>
          Weiter
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}
