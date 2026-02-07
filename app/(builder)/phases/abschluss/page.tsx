import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step10Complete from "@/app/(builder)/phases/steps/Step10Complete";

export default function AbschlussPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step10Complete />
      </section>
      <SiteFooter />
    </main>
  );
}
