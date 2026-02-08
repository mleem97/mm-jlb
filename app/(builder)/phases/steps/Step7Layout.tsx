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
import { useTranslations } from "@/i18n/client";
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
  const tc = useTranslations("common");
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
              {tc("recommended")}
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

// ─── Template Mini Preview ─────────────────────────────────
/** Renders a small schematic preview that visually matches the actual PDF template layout. */
function TemplateMiniPreview({ template }: { template: (typeof templates)[number] }) {
  const { bg, accent, text } = template.previewColors;
  const lineStyle = (w: string, opacity = 0.15) => ({
    backgroundColor: text,
    opacity,
  });

  switch (template.id) {
    case "classic":
      return (
        <div className="h-36 relative" style={{ backgroundColor: bg }}>
          {/* Name with bottom border — single column, no sidebar */}
          <div className="px-4 pt-4">
            <div className="h-3 w-2/3 rounded-sm" style={{ backgroundColor: accent }} />
            <div className="h-[1px] mt-2 w-full" style={{ backgroundColor: accent, opacity: 0.3 }} />
          </div>
          <div className="px-4 mt-2 space-y-1.5">
            <div className="h-1.5 rounded-full w-1/3" style={{ backgroundColor: text, opacity: 0.12 }} />
            <div className="h-[1px] mt-1 mb-1 w-full" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
            <div className="h-1.5 rounded-full w-4/5" style={lineStyle("4/5")} />
            <div className="h-1.5 rounded-full w-1/3 mt-2" style={{ backgroundColor: text, opacity: 0.12 }} />
            <div className="h-[1px] mt-1 mb-1 w-full" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
            <div className="h-1.5 rounded-full w-3/5" style={lineStyle("3/5")} />
          </div>
        </div>
      );

    case "modern":
      return (
        <div className="h-36 relative" style={{ backgroundColor: bg }}>
          {/* Colored header band with name inside */}
          <div
            className="px-4 pt-3 pb-2"
            style={{ backgroundColor: accent }}
          >
            <div className="h-3 w-1/2 rounded-sm bg-white/90" />
            <div className="h-1 mt-1 w-2/3 rounded-full bg-white/50" />
          </div>
          {/* Left accent bar */}
          <div className="absolute left-0 top-[52px] bottom-0 w-1" style={{ backgroundColor: accent }} />
          <div className="pl-5 pr-4 mt-2 space-y-1.5">
            <div className="h-1.5 w-1/3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.6 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
            <div className="h-1.5 rounded-full w-4/5" style={lineStyle("4/5")} />
            <div className="h-1.5 w-1/3 rounded-sm mt-1" style={{ backgroundColor: accent, opacity: 0.6 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
            <div className="h-1.5 rounded-full w-2/3" style={lineStyle("2/3")} />
          </div>
        </div>
      );

    case "creative":
      return (
        <div className="h-36 relative flex" style={{ backgroundColor: bg }}>
          {/* Left sidebar */}
          <div className="w-[72px] shrink-0 p-2 pt-3" style={{ backgroundColor: accent }}>
            <div className="h-8 w-8 mx-auto rounded-full bg-white/30" />
            <div className="mt-2 space-y-1">
              <div className="h-1 rounded-full bg-white/60 w-full" />
              <div className="h-1 rounded-full bg-white/40 w-4/5" />
              <div className="h-1 rounded-full bg-white/40 w-3/5" />
              <div className="mt-2 h-1 rounded-full bg-white/60 w-full" />
              <div className="h-1 rounded-full bg-white/40 w-4/5" />
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 p-3 space-y-2">
            <div className="h-2.5 w-3/4 rounded-sm" style={{ backgroundColor: accent, opacity: 0.8 }} />
            <div className="h-1 w-1/2 rounded-full" style={lineStyle("half", 0.1)} />
            <div className="h-1.5 w-1/4 rounded-sm mt-1" style={{ backgroundColor: accent, opacity: 0.5 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
            <div className="h-1.5 rounded-full w-4/5" style={lineStyle("4/5")} />
            <div className="h-1.5 w-1/4 rounded-sm mt-1" style={{ backgroundColor: accent, opacity: 0.5 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
          </div>
        </div>
      );

    case "tech":
      return (
        <div className="h-36 relative" style={{ backgroundColor: bg }}>
          {/* Thin top accent stripe */}
          <div className="h-1.5" style={{ backgroundColor: accent }} />
          <div className="px-4 pt-2">
            <div className="h-2.5 w-2/5 rounded-sm" style={{ backgroundColor: accent, opacity: 0.85 }} />
            <div className="h-1 w-1/3 rounded-full mt-1" style={lineStyle("1/3", 0.1)} />
          </div>
          {/* Tech stack badges */}
          <div className="px-4 mt-2 flex gap-1 flex-wrap">
            {[28, 22, 32, 18, 26].map((w, i) => (
              <div
                key={i}
                className="h-2.5 rounded-sm"
                style={{ width: w, backgroundColor: accent, opacity: 0.15 }}
              />
            ))}
          </div>
          <div className="px-4 mt-2 space-y-1.5">
            <div className="h-1.5 w-1/3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.5 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
            <div className="h-1.5 rounded-full w-3/4" style={lineStyle("3/4")} />
          </div>
        </div>
      );

    case "executive":
      return (
        <div className="h-36 relative" style={{ backgroundColor: bg }}>
          {/* Elegant name, thin line — no color blocks */}
          <div className="px-4 pt-5">
            <div className="h-3 w-1/2 rounded-sm" style={{ backgroundColor: accent, opacity: 0.85 }} />
            <div className="h-[0.5px] mt-1.5 w-1/3" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div className="h-1 w-2/3 rounded-full mt-1" style={lineStyle("2/3", 0.08)} />
          </div>
          <div className="px-4 mt-3 space-y-1.5">
            <div className="h-1 w-1/4 rounded-sm uppercase tracking-widest" style={{ backgroundColor: accent, opacity: 0.35 }} />
            <div className="h-[0.5px] w-1/4" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
            <div className="h-1.5 rounded-full w-4/5" style={lineStyle("4/5")} />
            <div className="h-1 w-1/4 rounded-sm mt-1.5" style={{ backgroundColor: accent, opacity: 0.35 }} />
            <div className="h-[0.5px] w-1/4" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div className="h-1.5 rounded-full w-full" style={lineStyle("full")} />
          </div>
        </div>
      );

    case "academic":
      return (
        <div className="h-36 relative" style={{ backgroundColor: bg }}>
          {/* Dense, clean, section-heavy layout */}
          <div className="px-4 pt-3">
            <div className="h-2.5 w-2/5 rounded-sm" style={{ backgroundColor: accent }} />
            <div className="h-1 w-1/2 rounded-full mt-1" style={lineStyle("half", 0.1)} />
          </div>
          <div className="px-4 mt-2 space-y-1">
            <div className="h-1.5 w-1/3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.55 }} />
            <div className="h-[1.5px] w-1/3" style={{ backgroundColor: accent, opacity: 0.4 }} />
            <div className="h-1 rounded-full w-full" style={lineStyle("full", 0.12)} />
            <div className="h-1 rounded-full w-4/5" style={lineStyle("4/5", 0.12)} />
            <div className="h-1.5 w-1/3 rounded-sm mt-1" style={{ backgroundColor: accent, opacity: 0.55 }} />
            <div className="h-[1.5px] w-1/3" style={{ backgroundColor: accent, opacity: 0.4 }} />
            <div className="h-1 rounded-full w-full" style={lineStyle("full", 0.12)} />
            <div className="h-1 rounded-full w-3/5" style={lineStyle("3/5", 0.12)} />
            <div className="h-1 rounded-full w-full" style={lineStyle("full", 0.12)} />
          </div>
        </div>
      );

    default:
      return (
        <div className="h-36 relative" style={{ backgroundColor: bg }}>
          <div className="absolute top-0 left-0 right-0 h-10" style={{ backgroundColor: accent }} />
        </div>
      );
  }
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
      <div className="relative">
        <TemplateMiniPreview template={template} />
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

  const pc = layoutConfig.primaryColor;
  const sc = layoutConfig.secondaryColor;
  const isMinimal = layoutConfig.headerStyle === "minimal";
  const isCentered = layoutConfig.headerStyle === "centered";
  const showPhoto = layoutConfig.showPhoto;
  const photoLeft = layoutConfig.photoPosition === "top-left";

  const baseFontSize = (layoutConfig.fontSize / 12) * 7;

  /** Reusable photo placeholder */
  const PhotoBlock = ({ round = false, size = 32, className = "" }: { round?: boolean; size?: number; className?: string }) => (
    <div
      className={`flex items-center justify-center shrink-0 ${round ? "rounded-full" : "rounded-sm"} ${className}`}
      style={{
        width: round ? size : size * 0.8,
        height: size,
        backgroundColor: sc,
      }}
    >
      <span className="text-[5px] font-bold" style={{ color: pc }}>Foto</span>
    </div>
  );

  /** Reusable section heading */
  const SectionTitle = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div
      className="text-[7px] font-bold pb-0.5 mb-1"
      style={{
        color: pc,
        borderBottom: `1px solid ${pc}40`,
        ...style,
      }}
    >
      {children}
    </div>
  );

  /** Placeholder content lines */
  const ContentLines = ({ widths = ["100%", "80%", "60%"] }: { widths?: string[] }) => (
    <div className="space-y-1">
      {widths.map((w, i) => (
        <div key={i} className="h-[3px] rounded-full bg-gray-200" style={{ width: w }} />
      ))}
    </div>
  );

  /** Skill badges */
  const SkillBadges = ({ items = ["Skill 1", "Skill 2", "Skill 3"] }: { items?: string[] }) => (
    <div className="flex gap-1 flex-wrap">
      {items.map((s) => (
        <div
          key={s}
          className="text-[5px] rounded px-1 py-0.5"
          style={{ backgroundColor: sc, color: pc }}
        >
          {s}
        </div>
      ))}
    </div>
  );

  // ── Template-specific layouts ────────────────────────
  const renderClassic = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header — white background, name with underline */}
      <div
        className={`px-3 py-2.5 ${isCentered ? "text-center" : ""}`}
        style={{ borderBottom: `2px solid ${pc}` }}
      >
        <div className="flex items-start justify-between">
          <div className={isCentered ? "w-full" : ""}>
            <div className={`font-bold ${isMinimal ? "text-[9px]" : "text-[11px]"}`} style={{ color: pc }}>
              {displayName}
            </div>
            {!isMinimal && (
              <div className="text-[6px] text-gray-500 mt-0.5">
                {displayEmail} · {displayPhone}
              </div>
            )}
            {!isMinimal && (
              <div className="text-[5px] text-gray-400 mt-0.5">{displayAddress}</div>
            )}
          </div>
          {showPhoto && <PhotoBlock size={38} className={photoLeft ? "order-first mr-2" : "ml-2"} />}
        </div>
      </div>
      <div className="flex-1 px-3 py-2 space-y-2">
        <div><SectionTitle>Berufserfahrung</SectionTitle><ContentLines /></div>
        <div><SectionTitle>Ausbildung</SectionTitle><ContentLines widths={["100%", "75%"]} /></div>
        <div><SectionTitle>Kenntnisse</SectionTitle><SkillBadges /></div>
      </div>
    </div>
  );

  const renderModern = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Colored header band */}
      <div
        className={`px-3 py-2.5 ${isCentered ? "text-center" : ""}`}
        style={{ backgroundColor: pc, color: "#fff" }}
      >
        <div className="flex items-start justify-between">
          <div className={isCentered ? "w-full" : ""}>
            <div className={`font-bold ${isMinimal ? "text-[9px]" : "text-[11px]"}`}>
              {displayName}
            </div>
            {!isMinimal && (
              <div className="text-[6px] opacity-80 mt-0.5">
                {displayEmail} · {displayPhone}
              </div>
            )}
          </div>
          {showPhoto && <PhotoBlock size={36} className={photoLeft ? "order-first mr-2" : "ml-2"} />}
        </div>
      </div>
      {/* Accent left bar + content */}
      <div className="flex flex-1">
        <div style={{ width: 3, backgroundColor: pc }} />
        <div className="flex-1 px-3 py-2 space-y-2">
          <div><SectionTitle>Berufserfahrung</SectionTitle><ContentLines /></div>
          <div><SectionTitle>Ausbildung</SectionTitle><ContentLines widths={["100%", "75%"]} /></div>
          <div><SectionTitle>Kenntnisse</SectionTitle><SkillBadges /></div>
        </div>
      </div>
    </div>
  );

  const renderCreative = () => (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className="flex flex-col items-center pt-4 px-2 gap-2"
        style={{ width: 72, backgroundColor: pc, color: "#fff" }}
      >
        {showPhoto && <PhotoBlock round size={40} />}
        <div className="mt-2 w-full px-1 space-y-1.5">
          <div className="h-[3px] rounded-full bg-white/60 w-full" />
          <div className="h-[3px] rounded-full bg-white/40 w-4/5" />
          <div className="h-[3px] rounded-full bg-white/40 w-3/5" />
          <div className="mt-2 h-[3px] rounded-full bg-white/60 w-full" />
          <div className="h-[3px] rounded-full bg-white/40 w-4/5" />
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 flex flex-col px-3 py-2 space-y-2 min-w-0">
        <div className={`${isCentered ? "text-center" : ""}`}>
          <div className={`font-bold ${isMinimal ? "text-[9px]" : "text-[11px]"}`} style={{ color: pc }}>
            {displayName}
          </div>
          {!isMinimal && <div className="text-[5px] text-gray-500 mt-0.5">{displayEmail} · {displayPhone}</div>}
        </div>
        <div><SectionTitle>Berufserfahrung</SectionTitle><ContentLines /></div>
        <div><SectionTitle>Ausbildung</SectionTitle><ContentLines widths={["100%", "75%"]} /></div>
        <div><SectionTitle>Kenntnisse</SectionTitle><SkillBadges /></div>
      </div>
    </div>
  );

  const renderTech = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Thin accent bar on top */}
      <div style={{ height: 4, backgroundColor: pc }} />
      <div className={`px-3 py-2 ${isCentered ? "text-center" : ""}`}>
        <div className="flex items-start justify-between">
          <div className={isCentered ? "w-full" : ""}>
            <div className={`font-bold ${isMinimal ? "text-[9px]" : "text-[11px]"}`} style={{ color: pc }}>
              {displayName}
            </div>
            {!isMinimal && <div className="text-[5px] text-gray-500 mt-0.5">{displayEmail} · {displayPhone}</div>}
          </div>
          {showPhoto && <PhotoBlock size={34} className={photoLeft ? "order-first mr-2" : "ml-2"} />}
        </div>
      </div>
      {/* Tech stack badges first */}
      <div className="px-3">
        <SectionTitle>Tech Stack</SectionTitle>
        <SkillBadges items={["React", "TypeScript", "Node.js", "Docker"]} />
      </div>
      <div className="px-3 py-2 space-y-2">
        <div><SectionTitle>Projekte</SectionTitle><ContentLines widths={["100%", "85%"]} /></div>
        <div><SectionTitle>Berufserfahrung</SectionTitle><ContentLines widths={["100%", "70%"]} /></div>
      </div>
    </div>
  );

  const renderExecutive = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Generous whitespace, elegant name, thin line */}
      <div className={`px-4 pt-4 pb-1 ${isCentered ? "text-center" : ""}`}>
        <div className="flex items-start justify-between">
          <div className={isCentered ? "w-full" : ""}>
            <div className={`font-bold ${isMinimal ? "text-[9px]" : "text-[12px]"}`} style={{ color: pc }}>
              {displayName}
            </div>
            <div className="mt-1" style={{ height: 0.5, backgroundColor: pc, opacity: 0.3, width: "40%" }} />
            {!isMinimal && (
              <div className="text-[5px] text-gray-400 mt-1">{displayEmail} · {displayPhone}</div>
            )}
          </div>
          {showPhoto && <PhotoBlock size={38} className={photoLeft ? "order-first mr-3" : "ml-3"} />}
        </div>
      </div>
      <div className="flex-1 px-4 py-2 space-y-2.5">
        <div>
          <div className="text-[5.5px] font-bold tracking-[0.1em] uppercase pb-0.5 mb-1" style={{ color: pc, borderBottom: `0.5px solid ${pc}30` }}>
            Berufserfahrung
          </div>
          <ContentLines />
        </div>
        <div>
          <div className="text-[5.5px] font-bold tracking-[0.1em] uppercase pb-0.5 mb-1" style={{ color: pc, borderBottom: `0.5px solid ${pc}30` }}>
            Bildung
          </div>
          <ContentLines widths={["100%", "70%"]} />
        </div>
        <div>
          <div className="text-[5.5px] font-bold tracking-[0.1em] uppercase pb-0.5 mb-1" style={{ color: pc, borderBottom: `0.5px solid ${pc}30` }}>
            Kenntnisse
          </div>
          <div className="text-[5px] text-gray-400">React, TypeScript, Leadership, Strategie</div>
        </div>
      </div>
    </div>
  );

  const renderAcademic = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Dense, section-heavy layout with bold headers + thick underlines */}
      <div className={`px-3 py-2 ${isCentered ? "text-center" : ""}`}>
        <div className={`font-bold ${isMinimal ? "text-[9px]" : "text-[11px]"}`} style={{ color: pc }}>
          {displayName}
        </div>
        {!isMinimal && <div className="text-[5px] text-gray-500 mt-0.5">{displayEmail} · {displayPhone}</div>}
      </div>
      <div className="flex-1 px-3 space-y-1.5">
        <div>
          <div className="text-[6.5px] font-bold" style={{ color: pc, borderBottom: `1.5px solid ${pc}` }}>
            Forschungsinteressen
          </div>
          <ContentLines widths={["100%", "85%"]} />
        </div>
        <div>
          <div className="text-[6.5px] font-bold" style={{ color: pc, borderBottom: `1.5px solid ${pc}` }}>
            Bildung
          </div>
          <ContentLines widths={["100%", "70%"]} />
        </div>
        <div>
          <div className="text-[6.5px] font-bold" style={{ color: pc, borderBottom: `1.5px solid ${pc}` }}>
            Publikationen
          </div>
          <ContentLines widths={["100%", "90%", "100%"]} />
        </div>
        <div>
          <div className="text-[6.5px] font-bold" style={{ color: pc, borderBottom: `1.5px solid ${pc}` }}>
            Akademische Laufbahn
          </div>
          <ContentLines widths={["100%", "75%"]} />
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (layoutConfig.templateId) {
      case "modern": return renderModern();
      case "creative": return renderCreative();
      case "tech": return renderTech();
      case "executive": return renderExecutive();
      case "academic": return renderAcademic();
      case "classic":
      default: return renderClassic();
    }
  };

  return (
    <div
      className="bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200 origin-top-left"
      style={{
        width: 298,
        height: 421,
        transform: `scale(${zoom / 100})`,
        fontFamily: layoutConfig.fontFamily,
        fontSize: `${baseFontSize}px`,
      }}
    >
      {layoutConfig.templateId === "creative" ? (
        renderTemplate()
      ) : (
        <div className="flex h-full">{renderTemplate()}</div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function Step7Layout() {
  const router = useRouter();
  const t = useTranslations("step7");
  const tc = useTranslations("common");

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
      // Only change template ID — preserve user's color choices
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
      {/* ─── Progress ─────────────────────────────────── */}
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

          {/* ── 7.2 Template Selection ────────────────── */}
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

          {/* ── 7.3 Design Customization ──────────────── */}
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
              {/* Colors */}
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

                {/* Palette presets */}
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

              {/* Typography */}
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
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
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

              {/* Header & Photo */}
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
                      {HEADER_STYLE_OPTIONS.map((h) => (
                        <option key={h.value} value={h.value}>
                          {t(h.key)}
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
                      {PHOTO_POSITION_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {t(p.key)}
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

          {/* ── 7.4 Live Preview ──────────────────────── */}
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
                {t("previewDisclaimer")}
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
                {tc("tips")}
              </h3>
              <ul className="space-y-3">
                {[t("tip1"), t("tip2"), t("tip3")].map((tip, i) => (
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
