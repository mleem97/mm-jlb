"use client";

import { useMemo } from "react";
import { runATSCheck } from "@/lib/utils/atsCheck";
import type { ApplicationState } from "@/types/application";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface ATSScoreProps {
  state: ApplicationState;
}

function getTrafficLightColor(score: number): string {
  if (score < 50) return "#ef4444";
  if (score < 80) return "#eab308";
  return "#22c55e";
}

function getStatusLabel(score: number): string {
  if (score < 50) return "Kritisch";
  if (score < 80) return "Verbesserungswürdig";
  return "Gut";
}

function SeverityIcon({
  passed,
  severity,
}: {
  passed: boolean;
  severity: "error" | "warning" | "info";
}) {
  if (passed) {
    return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
  }
  switch (severity) {
    case "error":
      return <XCircle className="h-4 w-4 text-red-500 shrink-0" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
  }
}

export function ATSScore({ state }: ATSScoreProps) {
  const result = useMemo(() => runATSCheck(state), [state]);

  const color = getTrafficLightColor(result.score);

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">ATS-Kompatibilität</h3>

      {/* Traffic light + score */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: color }}
        >
          {result.score}
        </div>
        <div>
          <p className="font-medium" style={{ color }}>
            {getStatusLabel(result.score)}
          </p>
          <p className="text-sm text-muted-foreground">
            {result.checks.filter((c) => c.passed).length} von{" "}
            {result.checks.length} Prüfungen bestanden
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {result.checks.map((check) => (
          <div
            key={check.name}
            className="flex items-start gap-2 text-sm"
          >
            <SeverityIcon passed={check.passed} severity={check.severity} />
            <div>
              <span className="font-medium">{check.name}: </span>
              <span className="text-muted-foreground">{check.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
