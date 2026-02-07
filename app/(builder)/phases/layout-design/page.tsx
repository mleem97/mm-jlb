import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step7Layout from "@/app/(builder)/phases/steps/Step7Layout";

export default function LayoutDesignPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step7Layout />
      </section>
      <SiteFooter />
    </main>
  );
}
