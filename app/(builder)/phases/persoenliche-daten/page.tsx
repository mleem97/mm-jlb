"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useApplicationStore } from "@/store/applicationStore";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import Step1PersonalData from "@/app/(builder)/phases/steps/Step1PersonalData";

export default function Step1Page() {
  const router = useRouter();
  const personalData = useApplicationStore((s) => s.personalData);

  useEffect(() => {
    const mode = localStorage.getItem("jlb:builder:mode");
    const hasStoreData = personalData.firstName.length > 0 || personalData.lastName.length > 0;
    if (!mode && !hasStoreData) {
      router.replace("/intro");
    }
  }, [router, personalData]);

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <Step1PersonalData />
      </section>
      <SiteFooter />
    </main>
  );
}
