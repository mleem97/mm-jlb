"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, CheckCircle2, Info, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useTranslations } from "@/i18n/client";
import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { OnlineStatus } from "@/components/ui/online-status";
import { formatRelativeTime } from "@/lib/utils/relativeTime";
import { compressImage } from "@/lib/utils/imageCompression";
import { PhotoCropDialog } from "@/components/features/PhotoCropDialog";

const optionalUrl = z.string().url("Bitte eine gültige URL angeben").optional().or(z.literal(""));

const personalDataSchema = z.object({
  firstName: z
    .string()
    .min(2, "Mindestens 2 Zeichen")
    .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/, "Nur Buchstaben"),
  lastName: z
    .string()
    .min(2, "Mindestens 2 Zeichen")
    .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/, "Nur Buchstaben"),
  email: z.string().email("Gültige E-Mail-Adresse erforderlich"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Gültige Telefonnummer (international erlaubt)"),
  street: z.string().min(5, "Straße und Hausnummer angeben"),
  zip: z.string().regex(/^\d{5}$/, "Gültige 5-stellige PLZ"),
  city: z.string().min(2, "Stadt angeben"),
  country: z.string().min(2, "Land angeben"),
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  nationality: z.string().optional(),
  linkedInUrl: optionalUrl,
  portfolioUrl: optionalUrl,
});

type PersonalDataForm = z.infer<typeof personalDataSchema>;

// ─── Context-sensitive help tips ─────────────────────────────
const fieldHelpTips: Record<string, { title: string; tip: string }> = {
  firstName: {
    title: "Vorname",
    tip: "Verwende deinen offiziellen Vornamen, wie er in deinem Ausweis steht.",
  },
  lastName: {
    title: "Nachname",
    tip: "Dein Familienname. Doppelnamen mit Bindestrich sind erlaubt.",
  },
  email: {
    title: "E-Mail-Adresse",
    tip: "Nutze eine seriöse Adresse (z.\u00a0B. vorname.nachname@...). Vermeide Spaß-Adressen.",
  },
  phone: {
    title: "Telefonnummer",
    tip: "Internationale Formate sind erlaubt, z.\u00a0B. +49\u00a0170\u00a01234567 oder +1\u00a0555\u00a0123-4567.",
  },
  street: {
    title: "Straße & Hausnummer",
    tip: "Vollständige Adresse angeben, z.B. „Musterstraße 42a",
  },
  zip: {
    title: "Postleitzahl",
    tip: "Gib die 5-stellige PLZ deines Wohnorts ein.",
  },
  city: {
    title: "Stadt",
    tip: "Dein aktueller Wohnort. Wird im Anschreiben und Lebenslauf verwendet.",
  },
  country: {
    title: "Land",
    tip: "Wähle dein Wohnsitzland aus. Standard ist Deutschland.",
  },
  birthDate: {
    title: "Geburtsdatum",
    tip: "In Deutschland noch üblich, aber nicht gesetzlich vorgeschrieben.",
  },
  birthPlace: {
    title: "Geburtsort",
    tip: "Optional — kann im Lebenslauf erscheinen.",
  },
  nationality: {
    title: "Staatsangehörigkeit",
    tip: "Optional. Kann bei internationalen Bewerbungen relevant sein.",
  },
  linkedInUrl: {
    title: "LinkedIn URL",
    tip: "Dein öffentliches LinkedIn-Profil. Achte darauf, dass es aktuell ist.",
  },
  portfolioUrl: {
    title: "Portfolio URL",
    tip: "Link zu deiner Website oder Portfolio. Besonders für kreative und digitale Berufe empfohlen.",
  },
  default: {
    title: "Warum brauchen wir diese Daten?",
    tip: "Diese Informationen erscheinen auf deinem Anschreiben und Lebenslauf.",
  },
};

// ─── Required fields list for progress tracking ─────────────
const REQUIRED_FIELD_NAMES = ["firstName", "lastName", "email", "phone", "street", "zip", "city", "country"] as const;
export default function Step1PersonalData() {
  const t = useTranslations("step1");
  const tc = useTranslations("common");
  const router = useRouter();
  const { personalData, setPersonalData, nextStep, lastSaved } = useApplicationStore();
  const [showOptional, setShowOptional] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(personalData.photo ?? "");
  const [activeField, setActiveField] = useState<string>("default");
  const [lastSavedText, setLastSavedText] = useState("");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const defaultValues = useMemo(
    () => ({
      firstName: personalData.firstName,
      lastName: personalData.lastName,
      email: personalData.email,
      phone: personalData.phone,
      street: personalData.address.street,
      zip: personalData.address.zip,
      city: personalData.address.city,
      country: personalData.address.country || "Deutschland",
      birthDate: personalData.birthDate ?? "",
      birthPlace: personalData.birthPlace ?? "",
      nationality: personalData.nationality ?? "",
      linkedInUrl: personalData.linkedInUrl ?? "",
      portfolioUrl: personalData.portfolioUrl ?? "",
    }),
    [personalData]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
    defaultValues,
    mode: "onChange",
  });

  // ─── Last saved relative time updater ─────────────────────
  useEffect(() => {
    const update = () => setLastSavedText(formatRelativeTime(lastSaved));
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  // ─── Unsaved changes warning (beforeunload) ───────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ─── Required field progress calculation ──────────────────
  const watchedValues = watch();
  const requiredFieldsProgress = useMemo(() => {
    let filled = 0;
    for (const field of REQUIRED_FIELD_NAMES) {
      const value = watchedValues[field];
      if (value && String(value).trim().length > 0) {
        filled++;
      }
    }
    return { filled, total: REQUIRED_FIELD_NAMES.length };
  }, [watchedValues]);

  // ─── Focus tracking for context-sensitive help ────────────
  const handleFieldFocus = useCallback((fieldName: string) => {
    setActiveField(fieldName);
  }, []);

  const currentHelp = fieldHelpTips[activeField] ?? fieldHelpTips.default;

  const onSubmit = (data: PersonalDataForm) => {
    setPersonalData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: {
        street: data.street,
        zip: data.zip,
        city: data.city,
        country: data.country,
      },
      birthDate: data.birthDate || undefined,
      birthPlace: data.birthPlace || undefined,
      nationality: data.nationality || undefined,
      linkedInUrl: data.linkedInUrl || undefined,
      portfolioUrl: data.portfolioUrl || undefined,
    });
    nextStep();
    router.push("/phases/berufserfahrung");
  };

  const handlePhotoUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      // Read as data URL for the crop dialog
      const reader = new FileReader();
      reader.onload = () => {
        setRawPhotoSrc(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.onerror = () => {
        toast.error(tc("error"));
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error(tc("error"));
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    setCropDialogOpen(false);
    try {
      // Convert base64 to File for compression
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped-photo.jpg", { type: "image/jpeg" });
      const compressed = await compressImage(file);
      setPhotoPreview(compressed);
      setPersonalData({ photo: compressed });
      toast.success(tc("success"));
    } catch {
      toast.error(tc("error"));
    }
  };

  const handlePhotoDelete = () => {
    setPhotoPreview("");
    setPersonalData({ photo: undefined });
    toast.info(t("photoRemove"));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Schritt 1 von 9: {t("title")}</span>
          <span className="text-sm text-muted-foreground">11%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[11%] transition-all duration-300" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <Card className="p-6 h-fit sticky top-6 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{currentHelp.title}</h3>
              <p className="text-sm text-muted-foreground">{currentHelp.tip}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {[
              "100% lokal gespeichert",
              "Keine Server-Übertragung",
              "Jederzeit löschbar",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Required fields progress */}
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-1">
              {requiredFieldsProgress.filled}/{requiredFieldsProgress.total} Pflichtfelder ausgefüllt
            </p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${(requiredFieldsProgress.filled / requiredFieldsProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Last saved + online status */}
          <div className="border-t pt-3 flex items-center justify-between gap-2">
            {lastSaved ? (
              <p className="text-xs text-muted-foreground">
                {tc("saved")}: {lastSavedText}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{tc("save")}</p>
            )}
            <OnlineStatus />
          </div>
        </Card>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} ref={formRef} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t("firstName")} *</Label>
                <Input
                  id="firstName"
                  autoFocus
                  {...register("firstName")}
                  onFocus={() => handleFieldFocus("firstName")}
                  tabIndex={1}
                  placeholder="Max"
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName ? (
                  <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="lastName">{t("lastName")} *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  onFocus={() => handleFieldFocus("lastName")}
                  tabIndex={2}
                  placeholder="Mustermann"
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName ? (
                  <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{t("email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  onFocus={() => handleFieldFocus("email")}
                  tabIndex={3}
                  placeholder="max.mustermann@example.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                ) : null}
                <p className="text-xs text-muted-foreground mt-1">
                  Tipp: Verwende eine seriöse E-Mail-Adresse
                </p>
              </div>

              <div>
                <Label htmlFor="phone">{t("phone")} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  onFocus={() => handleFieldFocus("phone")}
                  tabIndex={4}
                  placeholder="+49 170 1234567"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone ? (
                  <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <Label htmlFor="street">{t("street")} *</Label>
              <Input
                id="street"
                {...register("street")}
                onFocus={() => handleFieldFocus("street")}
                tabIndex={5}
                placeholder="Musterstraße 42"
                className={errors.street ? "border-destructive" : ""}
              />
              {errors.street ? (
                <p className="text-xs text-destructive mt-1">{errors.street.message}</p>
              ) : null}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">{t("zip")} *</Label>
                <Input
                  id="zip"
                  {...register("zip")}
                  onFocus={() => handleFieldFocus("zip")}
                  tabIndex={6}
                  placeholder="30159"
                  maxLength={5}
                  className={errors.zip ? "border-destructive" : ""}
                />
                {errors.zip ? (
                  <p className="text-xs text-destructive mt-1">{errors.zip.message}</p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="city">{t("city")} *</Label>
                <Input
                  id="city"
                  {...register("city")}
                  onFocus={() => handleFieldFocus("city")}
                  tabIndex={7}
                  placeholder="Hannover"
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city ? (
                  <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <Label htmlFor="country">{t("country")} *</Label>
              <select
                id="country"
                {...register("country")}
                onFocus={() => handleFieldFocus("country")}
                tabIndex={8}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Deutschland">Deutschland</option>
                <option value="Österreich">Österreich</option>
                <option value="Schweiz">Schweiz</option>
                <option value="Andere">Andere</option>
              </select>
            </div>

            <div className="border-t pt-6">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              >
                <span>Weitere Angaben (optional)</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${showOptional ? "rotate-90" : ""}`}
                />
              </button>

              {showOptional ? (
                <div className="mt-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthDate">{t("birthDate")}</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...register("birthDate")}
                        onFocus={() => handleFieldFocus("birthDate")}
                        tabIndex={10}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Optional, aber in DE noch üblich
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="birthPlace">{t("birthPlace")}</Label>
                      <Input
                        id="birthPlace"
                        {...register("birthPlace")}
                        onFocus={() => handleFieldFocus("birthPlace")}
                        tabIndex={11}
                        placeholder="Hannover"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nationality">{t("nationality")}</Label>
                      <Input
                        id="nationality"
                        {...register("nationality")}
                        onFocus={() => handleFieldFocus("nationality")}
                        tabIndex={12}
                        placeholder="Deutsch"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                      <Input
                        id="linkedInUrl"
                        type="url"
                        {...register("linkedInUrl")}
                        onFocus={() => handleFieldFocus("linkedInUrl")}
                        tabIndex={13}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                    <Input
                      id="portfolioUrl"
                      type="url"
                      {...register("portfolioUrl")}
                      onFocus={() => handleFieldFocus("portfolioUrl")}
                      tabIndex={14}
                      placeholder="https://portfolio.example"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Für digitale Berufe empfohlen
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="photo">{t("photo")} ({tc("optional")})</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      capture="user"
                      tabIndex={15}
                      onChange={(event) => handlePhotoUpload(event.target.files?.[0])}
                    />
                    {photoPreview ? (
                      <div className="mt-3 flex items-end gap-3">
                        <img
                          src={photoPreview}
                          alt="Vorschau Bewerbungsfoto"
                          className="h-24 w-24 rounded-lg object-cover border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handlePhotoDelete}
                          className="gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t("photoRemove")}
                        </Button>
                      </div>
                    ) : null}
                    <p className="text-xs text-muted-foreground mt-1">
                      Optional für Deckblatt oder Profil. Max 500 KB, wird automatisch komprimiert.
                    </p>
                  </div>
                  <PhotoCropDialog
                    imageSrc={rawPhotoSrc}
                    open={cropDialogOpen}
                    onClose={() => setCropDialogOpen(false)}
                    onComplete={handleCropComplete}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => router.push("/intro")}>
                {tc("back")}
              </Button>
              <Button type="submit" size="lg" disabled={!isValid} className="gap-2">
                {tc("next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
