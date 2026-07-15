from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path('.')
changed: list[str] = []


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding='utf-8')


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    old = target.read_text(encoding='utf-8') if target.exists() else None
    if old != content:
        target.write_text(content, encoding='utf-8')
        changed.append(path)


# Dependency security updates and transitive overrides.
pkg_path = ROOT / 'package.json'
pkg = json.loads(pkg_path.read_text(encoding='utf-8'))
pkg['dependencies']['next'] = '16.2.6'
pkg['dependencies']['next-intl'] = '^4.9.2'
pkg['dependencies']['nodemailer'] = '^9.0.1'
pkg['devDependencies']['eslint-config-next'] = '16.2.6'
pnpm = pkg.setdefault('pnpm', {})
overrides = pnpm.setdefault('overrides', {})
overrides.update({
    '@babel/core': '7.29.6',
    'brace-expansion': '5.0.5',
    'picomatch': '4.0.4',
    'postcss': '8.5.10',
})
write('package.json', json.dumps(pkg, ensure_ascii=False, indent=2) + '\n')

# Server-action request authorization for this local-first application.
auth_source = '''import "server-only";

import { headers } from "next/headers";

export interface ActionAuthorization {
  host: string;
  origin: string;
}

/**
 * Authorize a browser initiated server action.
 *
 * The application has no user accounts, so authorization is based on a strict
 * same-origin boundary. This prevents third-party sites from invoking SMTP
 * actions with attacker-controlled parameters while preserving the local-first
 * product model.
 */
export async function auth(): Promise<ActionAuthorization> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = (forwardedHost ?? requestHeaders.get("host"))?.split(",")[0]?.trim();
  const originHeader = requestHeaders.get("origin");
  const refererHeader = requestHeaders.get("referer");
  const source = originHeader ?? refererHeader;

  if (!host || !source) {
    throw new Error("Nicht autorisierte Server-Aktion");
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(source);
  } catch {
    throw new Error("Ungültiger Anfrage-Ursprung");
  }

  if (sourceUrl.host !== host) {
    throw new Error("Nicht autorisierter Anfrage-Ursprung");
  }

  const fetchSite = requestHeaders.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    throw new Error("Cross-Site-Server-Aktion abgelehnt");
  }

  return { host, origin: sourceUrl.origin };
}
'''
write('lib/server/auth.ts', auth_source)

send_email = read('app/actions/sendEmail.ts')
if 'import { auth } from "@/lib/server/auth";' not in send_email:
    send_email = send_email.replace(
        'import nodemailer from "nodemailer";\n',
        'import nodemailer from "nodemailer";\n\nimport { auth } from "@/lib/server/auth";\n',
    )
send_email = send_email.replace(
    'export async function testSmtpConnection(smtp: SmtpConfig): Promise<SendEmailResult> {\n  try {',
    'export async function testSmtpConnection(smtp: SmtpConfig): Promise<SendEmailResult> {\n  await auth();\n\n  try {',
)
send_email = send_email.replace(
    '): Promise<SendEmailResult> {\n  try {\n    const transporter = nodemailer.createTransport({',
    '): Promise<SendEmailResult> {\n  await auth();\n\n  try {\n    const transporter = nodemailer.createTransport({',
    1,
)
write('app/actions/sendEmail.ts', send_email)

# Replace dynamic function dispatch with an explicit exhaustive switch.
templates = read('lib/email/templates.ts')
templates = re.sub(
    r'export function generateEmailContent\(\n  template: EmailTemplate,\n  data: EmailTemplateData,\n\): \{ subject: string; body: string \} \{\n  return templates\[template\]\(data\);\n\}',
    '''export function generateEmailContent(
  template: EmailTemplate,
  data: EmailTemplateData,
): { subject: string; body: string } {
  switch (template) {
    case "formal":
      return templates.formal(data);
    case "modern":
      return templates.modern(data);
  }
}''',
    templates,
)
write('lib/email/templates.ts', templates)

# Harden i18n lookup and promise handling against prototype pollution and races.
i18n = read('i18n/client.tsx')
i18n = re.sub(
    r'// Get nested value from object by dot-notation key\nfunction getNestedValue\(obj: unknown, path: string\): string \| undefined \{.*?\n\}',
    '''// Get nested value from object by dot-notation key
const BLOCKED_MESSAGE_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (
      BLOCKED_MESSAGE_KEYS.has(key) ||
      current === null ||
      typeof current !== "object" ||
      !Object.hasOwn(current, key)
    ) {
      return undefined;
    }
    current = Reflect.get(current, key);
  }

  return typeof current === "string" ? current : undefined;
}''',
    i18n,
    flags=re.S,
)
i18n = i18n.replace(
    'return values[key] !== undefined ? String(values[key]) : `{${key}}`;',
    'return Object.hasOwn(values, key) ? String(Reflect.get(values, key)) : `{${key}}`;',
)
i18n = i18n.replace(
    '''  useEffect(() => {
    setIsLoading(true);
    loadMessages(locale).then((msgs) => {
      setMessages(msgs);
      setIsLoading(false);
    });
  }, [locale]);''',
    '''  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    void loadMessages(locale)
      .then((msgs) => {
        if (!cancelled) setMessages(msgs);
      })
      .catch((error: unknown) => {
        console.error("[i18n] Failed to load messages", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);''',
)
write('i18n/client.tsx', i18n)

# Use Web Crypto for the confetti layout instead of Math.random().
complete = read('app/(builder)/phases/steps/Step10Complete.tsx')
if 'function secureRandom()' not in complete:
    marker = 'const CONFETTI_COLORS = '
    idx = complete.find(marker)
    if idx >= 0:
        end = complete.find(';', idx)
        if end >= 0:
            end += 1
            helper = '''

function secureRandom(): number {
  if (typeof globalThis.crypto !== "undefined") {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] / 2 ** 32;
  }

  // Deterministic fallback for non-browser rendering environments.
  return 0.5;
}
'''
            complete = complete[:end] + helper + complete[end:]
complete = complete.replace('Math.random()', 'secureRandom()')
write('app/(builder)/phases/steps/Step10Complete.tsx', complete)

# Move preview helper components out of LivePreview to preserve component identity.
layout_path = 'app/(builder)/phases/steps/Step7Layout.tsx'
layout = read(layout_path)
if 'interface PreviewPhotoBlockProps' not in layout:
    helpers = '''// ─── Live Preview helpers ──────────────────────────────────
interface PreviewPhotoBlockProps {
  primaryColor: string;
  secondaryColor: string;
  round?: boolean;
  size?: number;
  className?: string;
}

function PhotoBlock({
  primaryColor,
  secondaryColor,
  round = false,
  size = 32,
  className = "",
}: PreviewPhotoBlockProps) {
  return (
    <div
      className={`flex items-center justify-center shrink-0 ${round ? "rounded-full" : "rounded-sm"} ${className}`}
      style={{
        width: round ? size : size * 0.8,
        height: size,
        backgroundColor: secondaryColor,
      }}
    >
      <span className="text-[5px] font-semibold" style={{ color: primaryColor }}>
        Foto
      </span>
    </div>
  );
}

interface PreviewSectionTitleProps {
  primaryColor: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function SectionTitle({ primaryColor, children, style }: PreviewSectionTitleProps) {
  return (
    <div
      className="text-[7px] font-semibold pb-0.5 mb-1"
      style={{
        color: primaryColor,
        borderBottom: `1px solid ${primaryColor}40`,
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

interface PreviewSkillBadgesProps {
  primaryColor: string;
  secondaryColor: string;
  items?: string[];
}

function SkillBadges({
  primaryColor,
  secondaryColor,
  items = ["Skill 1", "Skill 2", "Skill 3"],
}: PreviewSkillBadgesProps) {
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map((skill) => (
        <div
          key={skill}
          className="text-[5px] rounded px-1 py-0.5"
          style={{ backgroundColor: secondaryColor, color: primaryColor }}
        >
          {skill}
        </div>
      ))}
    </div>
  );
}

'''
    layout = layout.replace('// ─── Live Preview ──────────────────────────────────────────', helpers + '// ─── Live Preview ──────────────────────────────────────────')
    layout = re.sub(
        r'\n  /\*\* Reusable photo placeholder \*/.*?\n  // ── Template-specific layouts',
        '\n  // ── Template-specific layouts',
        layout,
        flags=re.S,
    )
    layout = re.sub(r'<PhotoBlock(?![^>]*primaryColor)', '<PhotoBlock primaryColor={pc} secondaryColor={sc}', layout)
    layout = re.sub(r'<SectionTitle(?![^>]*primaryColor)', '<SectionTitle primaryColor={pc}', layout)
    layout = re.sub(r'<SkillBadges(?![^>]*primaryColor)', '<SkillBadges primaryColor={pc} secondaryColor={sc}', layout)
write(layout_path, layout)

# Motion accessibility: framework-level user preference plus CSS fallback.
motion_provider = '''"use client";

import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
'''
write('components/providers/MotionProvider.tsx', motion_provider)
root_layout = read('app/layout.tsx')
if 'MotionProvider' not in root_layout:
    root_layout = root_layout.replace(
        'import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";',
        'import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";\nimport { MotionProvider } from "@/components/providers/MotionProvider";',
    )
    root_layout = root_layout.replace(
        '        <LocaleProvider>\n          <KeyboardShortcutsProvider>',
        '        <LocaleProvider>\n          <MotionProvider>\n            <KeyboardShortcutsProvider>',
    )
    root_layout = root_layout.replace(
        '          </KeyboardShortcutsProvider>\n          <Toaster />\n        </LocaleProvider>',
        '            </KeyboardShortcutsProvider>\n            <Toaster />\n          </MotionProvider>\n        </LocaleProvider>',
    )
write('app/layout.tsx', root_layout)

globals_css = read('app/globals.css')
if 'prefers-reduced-motion: reduce' not in globals_css:
    globals_css += '''

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
'''
write('app/globals.css', globals_css)

# React 19 ref-as-prop API.
button = read('components/ui/button.tsx')
button = re.sub(
    r'export interface ButtonProps\n  extends React\.ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof buttonVariants> \{\n  asChild\?: boolean;\n\}\n\nconst Button = React\.forwardRef<HTMLButtonElement, ButtonProps>\(\n  \(\{ className, variant, size, asChild = false, \.\.\.props \}, ref\) => \{\n    const Comp = asChild \? Slot : "button";\n    return \(\n      <Comp\n        ref=\{ref\}\n        className=\{cn\(buttonVariants\(\{ variant, size, className \}\)\)\}\n        \{\.\.\.props\}\n      />\n    \);\n  \}\n\);\nButton\.displayName = "Button";',
    '''export type ButtonProps = React.ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ref, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}''',
    button,
)
write('components/ui/button.tsx', button)

# Safer browser navigation.
obfuscated = read('components/ObfuscatedText.tsx')
obfuscated = obfuscated.replace('const handleClick = () => {', 'const openObfuscatedAction = () => {')
obfuscated = obfuscated.replace(
    '    window.location.href = `${actionType}:${decoded}`;',
    '    const target = `${actionType}:${encodeURIComponent(decoded)}`;\n    window.open(target, "_self", "noopener,noreferrer");',
)
obfuscated = obfuscated.replace('onClick={handleClick}', 'onClick={openObfuscatedAction}')
write('components/ObfuscatedText.tsx', obfuscated)

data_management = read('components/features/DataManagement.tsx')
if 'useRouter' not in data_management:
    data_management = data_management.replace(
        'import { useState } from "react";',
        'import { useState } from "react";\nimport { useRouter } from "next/navigation";',
    )
    data_management = data_management.replace(
        '  const t = useTranslations("data");',
        '  const t = useTranslations("data");\n  const { replace } = useRouter();',
    )
data_management = data_management.replace('    window.location.href = "/intro";', '    replace("/intro");')
write('components/features/DataManagement.tsx', data_management)

# Avoid dynamic delete keys and explicitly ignore async work where intended.
attachments_path = 'app/(builder)/phases/steps/Step8Attachments.tsx'
attachments = read(attachments_path)
attachments = re.sub(
    r'setUploadProgress\(\(prev\) => \{\n\s+const next = \{ \.\.\.prev \};\n\s+delete next\[id\];\n\s+return next;\n\s+\}\);',
    'setUploadProgress((prev) =>\n              Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id)),\n            );',
    attachments,
)
attachments = attachments.replace('        processFiles(e.dataTransfer.files);', '        void processFiles(e.dataTransfer.files);')
attachments = attachments.replace('        processFiles(e.target.files);', '        void processFiles(e.target.files);')
write(attachments_path, attachments)

# Fix unsafe regular-expression parsing and unnecessary render state.
split_path = 'components/SplitText.tsx'
split = read(split_path)
split = split.replace('useState,', 'useRef,') if 'useState,' in split and 'useRef,' not in split else split
split = split.replace('const [fontsLoaded, setFontsLoaded] = useState(false);', 'const fontsLoaded = useRef(false);')
split = split.replace('setFontsLoaded(true);', 'fontsLoaded.current = true;')
split = split.replace(
    'const marginMatch = /^(-?\\d+(?:\\.\\d+)?)(px|em|rem|%)?$/.exec(rootMargin);',
    '''const marginValue = Number.parseFloat(rootMargin);
      const marginUnit = rootMargin.slice(String(marginValue).length);
      const marginMatch =
        Number.isFinite(marginValue) && ["", "px", "em", "rem", "%"].includes(marginUnit)
          ? ([rootMargin, String(marginValue), marginUnit] as const)
          : null;''',
)
write(split_path, split)

# Safe quick fixes from the static-analysis report.
for test_path in [
    '__tests__/importers/linkedinParser.test.ts',
    '__tests__/importers/xingParser.test.ts',
    '__tests__/data/skillSuggestions.test.ts',
]:
    p = ROOT / test_path
    if p.exists():
        text = p.read_text(encoding='utf-8')
        text = re.sub(r'([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)!\[(\d+)\]', r'\1?.[\2]', text)
        text = re.sub(r'([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)!\.length', r'\1?.length', text)
        write(test_path, text)

specific_replacements = {
    'app/(builder)/phases/steps/Step1PersonalData.tsx': [
        ('data.birthDate || undefined', 'data.birthDate ?? undefined'),
        ('data.birthPlace || undefined', 'data.birthPlace ?? undefined'),
        ('data.nationality || undefined', 'data.nationality ?? undefined'),
        ('data.linkedInUrl || undefined', 'data.linkedInUrl ?? undefined'),
    ],
    'app/(builder)/phases/steps/Step9Export.tsx': [
        ('companyName || "Firma"', 'companyName ?? "Firma"'),
    ],
    'app/(builder)/phases/welcome/page.tsx': [
        ('attachName.split("/").pop() || attachName', 'attachName.split("/").pop() ?? attachName'),
        ('        handleZipImport(file);', '        void handleZipImport(file);'),
    ],
    'store/applicationStore.ts': [
        ('    get().saveToIndexedDB();', '    void get().saveToIndexedDB();'),
    ],
    'components/features/JobMatchScore.tsx': [
        ('if (!jobDescriptionText?.trim()) return null;', 'if (!jobDescriptionText.trim()) return null;'),
    ],
}
for path, pairs in specific_replacements.items():
    p = ROOT / path
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    for old, new in pairs:
        text = text.replace(old, new)
    write(path, text)

# Accessibility and low-risk Tailwind normalization across JSX/TSX.
for path in list(ROOT.rglob('*.tsx')) + list(ROOT.rglob('*.jsx')):
    if any(part in {'.next', 'node_modules'} for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8')
    original = text
    text = re.sub(r'\s+autoFocus(?:=\{true\})?', '', text)
    text = re.sub(r'\s+tabIndex=\{[1-9]\d*\}', '', text)
    text = re.sub(r'\bw-([\w.\[\]/-]+)\s+h-\1\b', r'size-\1', text)
    text = re.sub(r'\bh-([\w.\[\]/-]+)\s+w-\1\b', r'size-\1', text)
    text = re.sub(r'(<h[1-6]\b[^>]*className=(?:"|\{`)[^>]*?)\bfont-bold\b', r'\1font-semibold', text)
    if text != original:
        write(str(path), text)

# Best-effort ESLint-friendly brace fixes for simple void event callbacks and cleanups.
for path in ROOT.rglob('*.tsx'):
    if any(part in {'.next', 'node_modules'} for part in path.parts):
        continue
    lines = path.read_text(encoding='utf-8').splitlines(keepends=True)
    out: list[str] = []
    changed_line = False
    for line in lines:
        updated = line
        if re.search(r'\bon[A-Z][A-Za-z]+=', line):
            updated = re.sub(
                r'(=>)\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\([^{};\n]*\))\}',
                r'\1 { \2; }}',
                updated,
            )
        updated = re.sub(
            r'return \(\) => ([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\([^{};\n]*\));',
            r'return () => { \1; };',
            updated,
        )
        updated = re.sub(
            r'(const\s+\w+\s*=\s*\(\)\s*=>)\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\([^{};\n]*\));',
            r'\1 { \2; };',
            updated,
        )
        if updated != line:
            changed_line = True
        out.append(updated)
    if changed_line:
        write(str(path), ''.join(out))

print('Changed files:')
for path in sorted(set(changed)):
    print(f'- {path}')
