"use client";

import { useMemo } from "react";

import { calculateJobMatch } from "@/lib/utils/jobMatchScore";
import type { Education } from "@/types/education";
import type { Skill } from "@/types/skills";
import type { WorkExperience } from "@/types/workExperience";

interface JobMatchScoreProps {
  jobDescriptionText: string;
  skills: Skill[];
  workExperience: WorkExperience[];
  education: Education[];
}

function getScoreColor(score: number): string {
  if (score < 40) return "#ef4444";
  if (score <= 70) return "#eab308";
  return "#22c55e";
}

function getScoreLabel(score: number): string {
  if (score < 40) return "Gering";
  if (score <= 70) return "Mittel";
  return "Gut";
}

export function JobMatchScore({
  jobDescriptionText,
  skills,
  workExperience,
  education,
}: JobMatchScoreProps) {
  const result = useMemo(
    () =>
      calculateJobMatch(jobDescriptionText, skills, workExperience, education),
    [jobDescriptionText, skills, workExperience, education],
  );

  if (!jobDescriptionText.trim()) return null;

  const color = getScoreColor(result.score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold">Job-Match-Score</h3>

      <div className="flex items-center gap-6">
        <div className="relative size-32">
          <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-muted/20"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold" style={{ color }}>
              {result.score}%
            </span>
            <span className="text-xs text-muted-foreground">
              {getScoreLabel(result.score)}
            </span>
          </div>
        </div>

        <p className="flex-1 text-sm text-muted-foreground">
          {result.matchedKeywords.length} von{" "}
          {result.matchedKeywords.length + result.missingKeywords.length}{" "}
          Keywords stimmen überein
        </p>
      </div>

      {result.matchedKeywords.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium">Übereinstimmende Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {result.missingKeywords.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium">Fehlende Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {result.missingKeywords.slice(0, 10).map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center rounded-full border border-red-300 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:border-red-700 dark:text-red-400"
              >
                {keyword}
              </span>
            ))}
            {result.missingKeywords.length > 10 ? (
              <span className="self-center text-xs text-muted-foreground">
                +{result.missingKeywords.length - 10} weitere
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {result.suggestions.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium">Vorschläge</p>
          <ul className="space-y-1">
            {result.suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-0.5 text-yellow-500">💡</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
