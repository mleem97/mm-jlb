"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Palette,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/i18n/client";
import {
  colorPalettes,
  type ColorPalette,
} from "@/lib/data/colorPalettes";
import { templates, type TemplateInfo } from "@/lib/data/templates";
import { useApplicationStore } from "@/store/applicationStore";
import type {
  FontFamily,
  HeaderStyle,
  LayoutConfig,
  PhotoPosition,
  TemplateId,
} from "@/types/layoutConfig";

const TOTAL_STEPS = 9;
const CURRENT_STEP = 7;

const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
];

const PHOTO_POSITION_OPTIONS: { value: PhotoPosition; key: string }[] = [
  { value: "top-right", key: "topRight" },
  { value: "top-left", key: "topLeft" },
  { value: "sidebar", key: "sidebar" },
];

const HEADER_STYLE_OPTIONS: { value: HeaderStyle; key: string }[] = [
  { value: "centered", key: "centered" },
  { value: "left-aligned", key: "leftAligned" },
  { value: "minimal", key: "minimal" },
];

interface DocumentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  recommended?: boolean;
  onChange: (checked: boolean) => void;
}

function DocumentCard({
  icon,
  title,
  description,
  checked,
  recommended = false,
  onChange,
}: DocumentCardProps) {
  const common = useTranslations("common");

  return (
    <motion.button
      type="button"
      onClick={() => {
        onChange(!checked);
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors ${
        checked
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/20 bg-card hover:border-muted-foreground/40"
      }`}
    >
      <span
        className={`shrink-0 rounded-lg p-2.5 ${
          checked
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold">{title}</span>
          {recommended ? (
            <Badge variant="secondary" className="text-xs">
              {common("recommended")}
            </Badge>
          ) : null}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30"
        }`}
      >
        {checked ? <Check className="size-3" /> : null}
      </span>
    </motion.button>
  );
}

function TemplateMiniPreview({ template }: { template: TemplateInfo }) {
  const { bg, accent, text } = template.previewColors;
  const hasSidebar = template.id === "creative" || template.id === "modern";

  return (
    <div className="relative flex h-36 overflow-hidden" style={{ backgroundColor: bg }}>
      {hasSidebar ? (
        <div className="w-12 shrink-0 p-2" style={{ backgroundColor: accent }}>
          <div className="mx-auto size-7 rounded-full bg-white/30" />
          <div className="mt-2 space-y-1">
            <div className="h-1 w-full rounded bg-white/60" />
            <div className="h-1 w-4/5 rounded bg-white/40" />
            <div className="h-1 w-3/5 rounded bg-white/40" />
          </div>
        </div>
      ) : null}
      <div className="flex-1 p-3">
        <div className="h-2.5 w-2/3 rounded" style={{ backgroundColor: accent }} />
        <div
          className="mt-1 h-1 w-1/2 rounded"
          style={{ backgroundColor: text, opacity: 0.15 }}
        />
        <div className="mt-3 space-y-1.5">
          {["100%", "82%", "92%", "65%"].map((width) => (
            <div
              key={width}
              className="h-1.5 rounded-full"
              style={{ width, backgroundColor: text, opacity: 0.12 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateInfo;
  selected: boolean;
  onSelect: (templateId: TemplateId) => void;
}

function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => {
        onSelect(template.id);
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-muted-foreground/20 hover:border-muted-foreground/40"
      }`}
    >
      <TemplateMiniPreview template={template} />
      <span className="block space-y-1 p-4">
        <span className="flex items-center justify-between gap-2">
          <span className="font-semibold">{template.name}</span>
          {selected ? <Check className="size-4 text-primary" /> : null}
        </span>
        <span className="block text-xs text-muted-foreground">
          {template.description}
        </span>
      </span>
    </motion.button>
  );
}

interface PaletteButtonProps {
  palette: ColorPalette;
  active: boolean;
  onSelect: (palette: ColorPalette) => void;
}

function PaletteButton({ palette, active, onSelect }: PaletteButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        onSelect(palette);
      }}
      className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-xs transition-colors ${
        active
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/20 hover:border-muted-foreground/40"
      }`}
    >
      <span className="flex gap-1" aria-hidden="true">
        <span className="size-5 rounded" style={{ backgroundColor: palette.primary }} />
        <span className="size-5 rounded" style={{ backgroundColor: palette.secondary }} />
      </span>
      <span className="font-medium">{palette.name}</span>
    </button>
  );
}

interface PreviewPhotoProps {
  primaryColor: string;
  secondaryColor: string;
  round?: boolean;
  className?: string;
}

function PreviewPhoto({
  primaryColor,
  secondaryColor,
  round = false,
  className = "",
}: PreviewPhotoProps) {
  return (
    <div
      className={`flex size-12 shrink-0 items-center justify-center ${
        round ? "rounded-full" : "rounded-sm"
      } ${className}`}
      style={{ backgroundColor: secondaryColor }}
    >
      <span className="text-[6px] font-semibold" style={{ color: primaryColor }}>
        Foto
      </span>
    </div>
  );
}

function PreviewSectionTitle({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mb-1 border-b pb-0.5 text-[7px] font-semibold"
      style={{ color, borderColor: `${color}40` }}
    >
      {children}
    </div>
  );
}

function PreviewLines({ widths = ["100%", "80%", "60%"] }: { widths?: string[] }) {
  return (
    <div className="space-y-1">
      {widths.map((width) => (
        <div
          key={width}
          className="h-[3px] rounded-full bg-gray-200"
          style={{ width }}
        />
      ))}
    </div>
  );
}

function PreviewSkills({
  primaryColor,
  secondaryColor,
}: {
  primaryColor: string;
  secondaryColor: string;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {["React", "TypeScript", "Projektmanagement"].map((skill) => (
        <span
          key={skill}
          className="rounded px-1 py-0.5 text-[5px]"
          style={{ backgroundColor: secondaryColor, color: primaryColor }}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function LivePreview({ zoom }: { zoom: number }) {
  const personalData = useApplicationStore((state) => state.personalData);
  const layout = useApplicationStore((state) => state.layoutConfig);
  const displayName =
    `${personalData.firstName} ${personalData.lastName}`.trim() ||
    "Max Mustermann";
  const contactLine = [personalData.email, personalData.phone]
    .filter(Boolean)
    .join(" · ") || "max@beispiel.de · 0170 1234567";
  const centered = layout.headerStyle === "centered";
  const minimal = layout.headerStyle === "minimal";
  const sidebar =
    layout.templateId === "creative" || layout.photoPosition === "sidebar";
  const photoLeft = layout.photoPosition === "top-left";

  return (
    <div
      className="flex aspect-[210/297] w-[420px] overflow-hidden rounded-sm bg-white text-gray-900 shadow-lg"
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: "top center",
        fontFamily: layout.fontFamily,
        fontSize: `${(layout.fontSize / 12) * 7}px`,
      }}
    >
      {sidebar ? (
        <aside
          className="w-24 shrink-0 space-y-3 p-3"
          style={{ backgroundColor: layout.primaryColor, color: "white" }}
        >
          {layout.showPhoto ? (
            <PreviewPhoto
              primaryColor={layout.primaryColor}
              secondaryColor={layout.secondaryColor}
              round
              className="mx-auto"
            />
          ) : null}
          <div className="text-[7px] font-semibold">Kontakt</div>
          <PreviewLines widths={["100%", "80%", "65%"]} />
          <div className="text-[7px] font-semibold">Kenntnisse</div>
          <PreviewLines widths={["90%", "70%", "85%"]} />
        </aside>
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col">
        <header
          className={`flex items-start justify-between gap-3 px-4 py-3 ${
            centered ? "text-center" : ""
          }`}
          style={
            layout.templateId === "modern"
              ? { backgroundColor: layout.primaryColor, color: "white" }
              : { borderBottom: `2px solid ${layout.primaryColor}` }
          }
        >
          {layout.showPhoto && photoLeft && !sidebar ? (
            <PreviewPhoto
              primaryColor={layout.primaryColor}
              secondaryColor={layout.secondaryColor}
            />
          ) : null}
          <div className={centered ? "flex-1" : "min-w-0 flex-1"}>
            <div className="text-[12px] font-semibold">{displayName}</div>
            {!minimal ? (
              <div className="mt-0.5 text-[6px] opacity-70">{contactLine}</div>
            ) : null}
          </div>
          {layout.showPhoto && !photoLeft && !sidebar ? (
            <PreviewPhoto
              primaryColor={layout.primaryColor}
              secondaryColor={layout.secondaryColor}
            />
          ) : null}
        </header>

        <div className="flex-1 space-y-3 p-4">
          <section>
            <PreviewSectionTitle color={layout.primaryColor}>
              Berufserfahrung
            </PreviewSectionTitle>
            <PreviewLines />
          </section>
          <section>
            <PreviewSectionTitle color={layout.primaryColor}>
              Ausbildung
            </PreviewSectionTitle>
            <PreviewLines widths={["100%", "76%"]} />
          </section>
          {!sidebar ? (
            <section>
              <PreviewSectionTitle color={layout.primaryColor}>
                Kenntnisse
              </PreviewSectionTitle>
              <PreviewSkills
                primaryColor={layout.primaryColor}
                secondaryColor={layout.secondaryColor}
              />
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function DesignControls({
  layout,
  onChange,
}: {
  layout: LayoutConfig;
  onChange: (changes: Partial<LayoutConfig>) => void;
}) {
  const t = useTranslations("step7");

  return (
    <Card className="space-y-6 p-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">{t("colors")}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">{t("primaryColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                id="primaryColor"
                type="color"
                value={layout.primaryColor}
                onChange={(event) => {
                  onChange({ primaryColor: event.target.value });
                }}
                className="h-9 w-14 cursor-pointer rounded border border-input"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {layout.primaryColor}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">{t("secondaryColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                id="secondaryColor"
                type="color"
                value={layout.secondaryColor}
                onChange={(event) => {
                  onChange({ secondaryColor: event.target.value });
                }}
                className="h-9 w-14 cursor-pointer rounded border border-input"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {layout.secondaryColor}
              </span>
            </div>
          </div>
        </div>
        <div>
          <Label className="mb-2 block">{t("colorPalettes")}</Label>
          <div className="flex flex-wrap gap-2">
            {colorPalettes.map((palette) => (
              <PaletteButton
                key={palette.name}
                palette={palette}
                active={
                  layout.primaryColor === palette.primary &&
                  layout.secondaryColor === palette.secondary
                }
                onSelect={(selectedPalette) => {
                  onChange({
                    primaryColor: selectedPalette.primary,
                    secondaryColor: selectedPalette.secondary,
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold">{t("typography")}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">{t("font")}</Label>
            <select
              id="fontFamily"
              value={layout.fontFamily}
              onChange={(event) => {
                onChange({ fontFamily: event.target.value as FontFamily });
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {FONT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontSize">
              {t("fontSizeLabel", { size: layout.fontSize })}
            </Label>
            <input
              id="fontSize"
              type="range"
              min={10}
              max={14}
              step={1}
              value={layout.fontSize}
              onChange={(event) => {
                onChange({ fontSize: Number(event.target.value) });
              }}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold">{t("headerAndPhoto")}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="headerStyle">{t("headerStyle")}</Label>
            <select
              id="headerStyle"
              value={layout.headerStyle}
              onChange={(event) => {
                onChange({ headerStyle: event.target.value as HeaderStyle });
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {HEADER_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.key)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoPosition">{t("photoPosition")}</Label>
            <select
              id="photoPosition"
              value={layout.photoPosition}
              disabled={!layout.showPhoto}
              onChange={(event) => {
                onChange({ photoPosition: event.target.value as PhotoPosition });
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              {PHOTO_POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.key)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="showPhoto"
            checked={layout.showPhoto}
            onCheckedChange={(checked) => {
              onChange({ showPhoto: checked });
            }}
          />
          <Label htmlFor="showPhoto" className="cursor-pointer">
            {t("showPhoto")}
          </Label>
        </div>
      </div>
    </Card>
  );
}

export default function Step7Layout() {
  const { push } = useRouter();
  const t = useTranslations("step7");
  const common = useTranslations("common");
  const documentSelection = useApplicationStore(
    (state) => state.documentSelection,
  );
  const layout = useApplicationStore((state) => state.layoutConfig);
  const setDocumentSelection = useApplicationStore(
    (state) => state.setDocumentSelection,
  );
  const setLayoutConfig = useApplicationStore(
    (state) => state.setLayoutConfig,
  );
  const [zoom, setZoom] = useState(100);

  const progress = useMemo(
    () => Math.round((CURRENT_STEP / TOTAL_STEPS) * 100),
    [],
  );

  const selectTemplate = useCallback(
    (templateId: TemplateId) => {
      setLayoutConfig({ templateId });
    },
    [setLayoutConfig],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">
            {common("stepOf", { current: CURRENT_STEP, total: TOTAL_STEPS })}: {t("title")}
          </span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <FileText className="size-5 text-primary" />
              {t("documentSelection")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <DocumentCard
                icon={<FileText className="size-5" />}
                title={t("coverLetter")}
                description={t("coverLetterDesc")}
                checked={documentSelection.includeCoverLetter}
                recommended
                onChange={(includeCoverLetter) => {
                  setDocumentSelection({ includeCoverLetter });
                }}
              />
              <DocumentCard
                icon={<BookOpen className="size-5" />}
                title={t("cv")}
                description={t("cvDesc")}
                checked={documentSelection.includeCV}
                recommended
                onChange={(includeCV) => {
                  setDocumentSelection({ includeCV });
                }}
              />
              <DocumentCard
                icon={<ImageIcon className="size-5" />}
                title={t("coverPage")}
                description={t("coverPageDesc")}
                checked={documentSelection.includeCoverPage}
                onChange={(includeCoverPage) => {
                  setDocumentSelection({ includeCoverPage });
                }}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Palette className="size-5 text-primary" />
              {t("selectTemplate")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={layout.templateId === template.id}
                  onSelect={selectTemplate}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Eye className="size-5 text-primary" />
              {t("designCustomization")}
            </h2>
            <DesignControls layout={layout} onChange={setLayoutConfig} />
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Eye className="size-5 text-primary" />
              {t("previewTitle")}
            </h2>
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                {([75, 100, 125] as const).map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setZoom(value);
                    }}
                    className={zoom === value ? "ring-2 ring-primary" : ""}
                  >
                    {value === 75 ? <ZoomOut className="mr-1 size-3" /> : null}
                    {value}%
                    {value === 125 ? <ZoomIn className="ml-1 size-3" /> : null}
                  </Button>
                ))}
              </div>
              <div className="flex min-h-[360px] justify-center overflow-auto rounded-lg bg-muted/30 p-6">
                <motion.div
                  key={`${layout.templateId}-${layout.primaryColor}-${layout.fontFamily}-${layout.showPhoto}-${layout.headerStyle}-${zoom}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <LivePreview zoom={zoom} />
                </motion.div>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {t("previewDisclaimer")}
              </p>
            </Card>
          </section>
        </div>

        <aside>
          <Card className="space-y-4 border-primary/20 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="size-4 text-amber-500" />
              {common("tips")}
            </h3>
            <ul className="space-y-3">
              {[
                { key: "tip1", text: t("tip1") },
                { key: "tip2", text: t("tip2") },
                { key: "tip3", text: t("tip3") },
              ].map((tip) => (
                <li
                  key={tip.key}
                  className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <span className="mt-0.5 shrink-0 text-amber-500">•</span>
                  {tip.text}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline">
          <Link href="/phases/anschreiben">
            <ChevronLeft className="mr-1 size-4" />
            {common("back")}
          </Link>
        </Button>
        <Button
          onClick={() => {
            push("/phases/anlagen");
          }}
        >
          {common("next")}
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}
