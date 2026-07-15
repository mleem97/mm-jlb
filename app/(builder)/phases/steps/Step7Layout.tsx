"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
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
import { useTranslations } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DocCard, PaletteButton, TemplateCard } from "./Step7LayoutControls";
import { LivePreview } from "./Step7LivePreview";
import { templates } from "@/lib/data/templates";
import { colorPalettes } from "@/lib/data/colorPalettes";
import type { TemplateId, FontFamily, PhotoPosition, HeaderStyle } from "@/types/layoutConfig";

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

export default function Step7Layout() {
  const router = useRouter();
  const t = useTranslations("step7");
  const tc = useTranslations("common");

  const documentSelection = useApplicationStore((s) => s.documentSelection);
  const layoutConfig = useApplicationStore((s) => s.layoutConfig);
  const setDocumentSelection = useApplicationStore((s) => s.setDocumentSelection);
  const setLayoutConfig = useApplicationStore((s) => s.setLayoutConfig);
  const lastSaved = useApplicationStore((s) => s.lastSaved);

  const [zoom, setZoom] = useState(100);

  const progress = useMemo(
    () => Math.min(Math.max(Math.round((CURRENT_STEP / TOTAL_STEPS) * 100), 0), 100),
    [],
  );

  const handleTemplateSelect = useCallback(
    (id: TemplateId) => {
      setLayoutConfig({ templateId: id });
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {tc("stepOf", { current: CURRENT_STEP, total: TOTAL_STEPS })}: {t("title")}
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
        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t("documentSelection")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DocCard
                icon={<FileText className="h-5 w-5" />}
                title={t("coverLetter")}
                description={t("coverLetterDesc")}
                checked={documentSelection.includeCoverLetter}
                recommended
                onChange={(checked) => setDocumentSelection({ includeCoverLetter: checked })}
              />
              <DocCard
                icon={<BookOpen className="h-5 w-5" />}
                title={t("cv")}
                description={t("cvDesc")}
                checked={documentSelection.includeCV}
                recommended
                onChange={(checked) => setDocumentSelection({ includeCV: checked })}
              />
              <DocCard
                icon={<ImageIcon className="h-5 w-5" />}
                title={t("coverPage")}
                description={t("coverPageDesc")}
                checked={documentSelection.includeCoverPage}
                onChange={(checked) => setDocumentSelection({ includeCoverPage: checked })}
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              {t("selectTemplate")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {t("designCustomization")}
            </h2>
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">{t("colors")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">{t("primaryColor")}</Label>
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
                    <Label htmlFor="secondaryColor">{t("secondaryColor")}</Label>
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

                <div>
                  <Label className="mb-2 block">{t("colorPalettes")}</Label>
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

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-semibold">{t("typography")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">{t("font")}</Label>
                    <select
                      id="fontFamily"
                      value={layoutConfig.fontFamily}
                      onChange={(e) => setLayoutConfig({ fontFamily: e.target.value as FontFamily })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">
                      {t("fontSizeLabel", { size: layoutConfig.fontSize })}
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

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-semibold">{t("headerAndPhoto")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerStyle">{t("headerStyle")}</Label>
                    <select
                      id="headerStyle"
                      value={layoutConfig.headerStyle}
                      onChange={(e) =>
                        setLayoutConfig({ headerStyle: e.target.value as HeaderStyle })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {HEADER_STYLE_OPTIONS.map((header) => (
                        <option key={header.value} value={header.value}>
                          {t(header.key)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photoPosition">{t("photoPosition")}</Label>
                    <select
                      id="photoPosition"
                      value={layoutConfig.photoPosition}
                      onChange={(e) =>
                        setLayoutConfig({ photoPosition: e.target.value as PhotoPosition })
                      }
                      disabled={!layoutConfig.showPhoto}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {PHOTO_POSITION_OPTIONS.map((position) => (
                        <option key={position.value} value={position.value}>
                          {t(position.key)}
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
                    {t("showPhoto")}
                  </Label>
                </div>
              </div>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {t("previewTitle")}
            </h2>
            <Card className="p-6">
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

              <div
                className="overflow-auto bg-muted/30 rounded-lg p-6 flex justify-center"
                style={{ minHeight: 300, maxHeight: 600 }}
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
                {t("previewDisclaimer")}
              </p>
            </Card>
          </motion.section>
        </div>

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
                {[t("tip1"), t("tip2"), t("tip3")].map((tip) => (
                  <li key={tip} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="shrink-0 text-amber-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {lastSaved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center"
            >
              {tc("lastSaved")}: {" "}
              {lastSaved.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </motion.div>
          )}
        </aside>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 mt-8 border-t"
      >
        <Button asChild variant="outline">
          <Link href="/phases/anschreiben">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {tc("back")}
          </Link>
        </Button>
        <Button onClick={handleNext}>
          {tc("next")}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}
