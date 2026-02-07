import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step5CertificatesProjects from "@/app/(builder)/phases/steps/Step5CertificatesProjects";

export default function CertificatesProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step5CertificatesProjects />
      </section>
      <SiteFooter />
    </main>
  );
}
