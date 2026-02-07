import { FileText } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          
          {/* Branding & Copyright */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-linear-to-br from-indigo-500 to-sky-500">
                <FileText className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold text-foreground">Job Letter Builder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026{" "}
              <a
                href="https://meyermedia.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              >
                Meyer Media
              </a>
              . Open Source unter MIT Lizenz.
            </p>
          </div>

          {/* Links: About */}
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-foreground">About</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <a href="/about" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Über uns</a>
              <a href="/functions" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Funktionen</a>
              <a href="/features" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Features</a>
            </div>
          </div>

          {/* Links: Ressourcen */}
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-foreground">Ressourcen</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <a href="/templates" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Templates</a>
              <a href="/faq" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">FAQ</a>
              <a href="/changelog" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Changelog & Roadmap</a>
            </div>
          </div>

          {/* Links: Rechtliches */}
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-foreground">Rechtliches</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <a href="/impressum" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Impressum</a>
              <a href="/datenschutz" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Datenschutz</a>
              <a href="/agb" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">AGB</a>
              <a href="/kontakt" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Kontakt</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}