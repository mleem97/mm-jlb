import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step6CoverLetter from "@/app/(builder)/phases/steps/Step6CoverLetter";

export default function CoverLetterPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step6CoverLetter />
      </section>
      <SiteFooter />
    </main>
  );
}
