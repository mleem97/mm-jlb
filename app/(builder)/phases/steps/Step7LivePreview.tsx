"use client";

import type { CSSProperties, ReactNode } from "react";

import { useApplicationStore } from "@/store/applicationStore";

// ─── Live Preview helpers ──────────────────────────────────
interface PhotoBlockProps {
  round?: boolean;
  size?: number;
  className?: string;
}

function PhotoBlock({ round = false, size = 32, className = "" }: PhotoBlockProps) {
  return (
    <div
      className={`flex items-center justify-center shrink-0 ${round ? "rounded-full" : "rounded-sm"} ${className}`}
      style={{
        width: round ? size : size * 0.8,
        height: size,
        backgroundColor: "var(--preview-secondary)",
      }}
    >
      <span className="text-[5px] font-bold" style={{ color: "var(--preview-primary)" }}>
        Foto
      </span>
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  style?: CSSProperties;
}

function SectionTitle({ children, style }: SectionTitleProps) {
  return (
    <div
      className="text-[7px] font-bold pb-0.5 mb-1"
      style={{
        color: "var(--preview-primary)",
        borderBottom: "1px solid var(--preview-primary-muted)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ContentLines({ widths = ["100%", "80%", "60%"] }: { widths?: string[] }) {
  return (
    <div className="space-y-1">
      {widths.map((width) => (
        <div key={width} className="h-[3px] rounded-full bg-gray-200" style={{ width }} />
      ))}
    </div>
  );
}

function SkillBadges({ items = ["Skill 1", "Skill 2", "Skill 3"] }: { items?: string[] }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map((skill) => (
        <div
          key={skill}
          className="text-[5px] rounded px-1 py-0.5"
          style={{
            backgroundColor: "var(--preview-secondary)",
            color: "var(--preview-primary)",
          }}
        >
          {skill}
        </div>
      ))}
    </div>
  );
}

// ─── Live Preview ──────────────────────────────────────────
interface LivePreviewProps {
  zoom: number;
}

export function LivePreview({ zoom }: LivePreviewProps) {
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

  const renderClassic = () => (
    <div className="flex-1 flex flex-col min-w-0">
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
        "--preview-primary": pc,
        "--preview-secondary": sc,
        "--preview-primary-muted": `${pc}40`,
      } as CSSProperties}
    >
      {layoutConfig.templateId === "creative" ? (
        renderTemplate()
      ) : (
        <div className="flex h-full">{renderTemplate()}</div>
      )}
    </div>
  );
}
