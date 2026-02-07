import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step2WorkExperience from "@/app/(builder)/phases/steps/Step2WorkExperience";

export default function Step2Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step2WorkExperience />
      </section>
      <SiteFooter />
    </main>
  );
}
