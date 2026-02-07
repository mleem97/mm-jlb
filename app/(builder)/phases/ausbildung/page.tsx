import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step3Education from "@/app/(builder)/phases/steps/Step3Education";

export default function Step3Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-2">Bildungsweg</h1>
        <p className="text-center text-muted-foreground mb-8">
          Erfasse deine Ausbildung und Abschlüsse
        </p>
        <Step3Education />
      </section>
      <SiteFooter />
    </main>
  );
}
