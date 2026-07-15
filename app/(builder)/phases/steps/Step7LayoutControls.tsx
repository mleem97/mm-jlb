"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";

import { useTranslations } from "@/i18n/client";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/data/templates";
import { colorPalettes } from "@/lib/data/colorPalettes";

// ─── Document Card ─────────────────────────────────────────
interface DocCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  recommended?: boolean;
  onChange: (checked: boolean) => void;
}

export function DocCard({ icon, title, description, checked, recommended, onChange }: DocCardProps) {
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

export function TemplateCard({ template, selected, onClick }: TemplateCardProps) {
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

export function PaletteButton({ palette, active, onClick }: PaletteButtonProps) {
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
