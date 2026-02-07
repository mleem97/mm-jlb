import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step9Export from "@/app/(builder)/phases/steps/Step9Export";

export default function Step9Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step9Export />
      </section>
      <SiteFooter />
    </main>
  );
}
