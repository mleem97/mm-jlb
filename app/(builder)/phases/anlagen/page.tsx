import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step8Attachments from "@/app/(builder)/phases/steps/Step8Attachments";

export default function AnlagenPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step8Attachments />
      </section>
      <SiteFooter />
    </main>
  );
}
