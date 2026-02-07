import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step4Skills from "@/app/(builder)/phases/steps/Step4Skills";

export default function Step4Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step4Skills />
      </section>
      <SiteFooter />
    </main>
  );
}
