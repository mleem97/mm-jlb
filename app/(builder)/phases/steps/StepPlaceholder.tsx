import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type StepPlaceholderProps = {
  step: number;
  title: string;
  description: string;
  prevHref?: string;
  nextHref?: string;
};

const totalSteps = 9;

function getProgress(step: number) {
  return Math.min(Math.max(Math.round((step / totalSteps) * 100), 0), 100);
}

export default function StepPlaceholder({ step, title, description, prevHref, nextHref }: StepPlaceholderProps) {
  const progress = getProgress(step);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Schritt {step} von {totalSteps}: {title}</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="p-8 space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground">Dieser Schritt ist vorbereitet und wird als Nächstes ausgebaut.</p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
          {prevHref ? (
            <Button asChild variant="outline">
              <Link href={prevHref}>Zurück</Link>
            </Button>
          ) : (
            <div />
          )}
          {nextHref ? (
            <Button asChild>
              <Link href={nextHref}>Weiter</Link>
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
