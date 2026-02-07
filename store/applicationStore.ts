import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ApplicationState, PersonalData } from "@/types/application";
import type { WorkExperience } from "@/types/workExperience";
import type { Education } from "@/types/education";
import type { Skill, Language } from "@/types/skills";
import type { Certificate } from "@/types/certificate";
import type { Project } from "@/types/project";
import type { JobPosting } from "@/types/jobPosting";
import type { CoverLetter, CoverLetterMeta } from "@/types/coverLetter";
import type { Attachment } from "@/types/attachment";
import type { DocumentSelection } from "@/types/documentSelection";
import type { LayoutConfig } from "@/types/layoutConfig";
import type { ApplicationImportData } from "@/types/import";
import type { ExportConfig, TrackerEntry } from "@/types/exportConfig";
import { applicationDb } from "@/lib/db/applicationDb";

interface ApplicationStore extends ApplicationState {
  // Application Name
  setApplicationName: (name: string) => void;

  // Personal Data
  setPersonalData: (data: Partial<PersonalData>) => void;

  // Work Experience
  addWorkExperience: (exp: WorkExperience) => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  reorderWorkExperience: (fromIndex: number, toIndex: number) => void;

  // Education
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;

  // Skills & Languages
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Certificates & Projects
  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, data: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;
  addProject: (proj: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Job Posting & Cover Letter
  setJobPosting: (data: JobPosting | null) => void;
  setCoverLetter: (data: CoverLetter | null) => void;
  setCoverLetterMeta: (data: CoverLetterMeta | null) => void;

  // Document Selection & Layout
  setDocumentSelection: (data: Partial<DocumentSelection>) => void;
  setLayoutConfig: (data: Partial<LayoutConfig>) => void;

  // Attachments
  addAttachment: (att: Attachment) => void;
  updateAttachment: (id: string, data: Partial<Attachment>) => void;
  removeAttachment: (id: string) => void;
  reorderAttachments: (fromIndex: number, toIndex: number) => void;

  // Export Config & Tracker
  setExportConfig: (data: Partial<ExportConfig>) => void;
  addTrackerEntry: (entry: TrackerEntry) => void;
  updateTrackerEntry: (id: string, data: Partial<TrackerEntry>) => void;
  removeTrackerEntry: (id: string) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;

  // Import / Export / Persistence
  importApplicationData: (data: ApplicationImportData) => void;
  resetApplication: () => void;
  saveToIndexedDB: () => Promise<void>;
}

const AUTO_SAVE_DELAY = 2000;
let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

const defaultPersonalData: PersonalData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: {
    street: "",
    zip: "",
    city: "",
    country: "Deutschland",
  },
};

const defaultDocumentSelection: DocumentSelection = {
  includeCoverLetter: true,
  includeCV: true,
  includeCoverPage: false,
};

const defaultLayoutConfig: LayoutConfig = {
  templateId: "classic",
  primaryColor: "#1a365d",
  secondaryColor: "#e2e8f0",
  fontFamily: "Inter",
  fontSize: 12,
  headerStyle: "centered",
  photoPosition: "top-right",
  showPhoto: true,
};

const defaultExportConfig: ExportConfig = {
  format: "pdf",
  pdfMode: "bundle",
  includeAttachments: true,
};

function triggerAutosave(get: () => ApplicationStore) {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    get().saveToIndexedDB();
  }, AUTO_SAVE_DELAY);
}

function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      // ─── State ──────────────────────────────────────
      currentStep: 1,
      totalSteps: 9,
      applicationName: "",
      personalData: defaultPersonalData,
      workExperience: [],
      education: [],
      skills: [],
      languages: [],
      certificates: [],
      projects: [],
      jobPosting: null,
      coverLetter: null,
      coverLetterMeta: null,
      attachments: [],
      documentSelection: defaultDocumentSelection,
      layoutConfig: defaultLayoutConfig,
      exportConfig: defaultExportConfig,
      trackerEntries: [],
      lastSaved: null,
      isValid: false,

      // ─── Application Name ──────────────────────────
      setApplicationName: (name) => {
        set({ applicationName: name, lastSaved: new Date() });
        triggerAutosave(get);
      },

      // ─── Personal Data ─────────────────────────────
      setPersonalData: (data) => {
        set((state) => {
          const nextAddress = data.address
            ? { ...state.personalData.address, ...data.address }
            : state.personalData.address;
          return {
            personalData: {
              ...state.personalData,
              ...data,
              address: nextAddress,
            },
            lastSaved: new Date(),
          };
        });
        triggerAutosave(get);
      },

      // ─── Work Experience ───────────────────────────
      addWorkExperience: (exp) => {
        set((s) => ({ workExperience: [...s.workExperience, exp], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateWorkExperience: (id, data) => {
        set((s) => ({
          workExperience: s.workExperience.map((e) => (e.id === id ? { ...e, ...data } : e)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeWorkExperience: (id) => {
        set((s) => ({
          workExperience: s.workExperience.filter((e) => e.id !== id),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      reorderWorkExperience: (from, to) => {
        set((s) => ({
          workExperience: reorder(s.workExperience, from, to),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },

      // ─── Education ─────────────────────────────────
      addEducation: (edu) => {
        set((s) => ({ education: [...s.education, edu], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateEducation: (id, data) => {
        set((s) => ({
          education: s.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeEducation: (id) => {
        set((s) => ({
          education: s.education.filter((e) => e.id !== id),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      reorderEducation: (from, to) => {
        set((s) => ({
          education: reorder(s.education, from, to),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },

      // ─── Skills ────────────────────────────────────
      addSkill: (skill) => {
        set((s) => ({ skills: [...s.skills, skill], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateSkill: (id, data) => {
        set((s) => ({
          skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...data } : sk)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeSkill: (id) => {
        set((s) => ({ skills: s.skills.filter((sk) => sk.id !== id), lastSaved: new Date() }));
        triggerAutosave(get);
      },

      // ─── Languages ─────────────────────────────────
      addLanguage: (lang) => {
        set((s) => ({ languages: [...s.languages, lang], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateLanguage: (id, data) => {
        set((s) => ({
          languages: s.languages.map((l) => (l.id === id ? { ...l, ...data } : l)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeLanguage: (id) => {
        set((s) => ({ languages: s.languages.filter((l) => l.id !== id), lastSaved: new Date() }));
        triggerAutosave(get);
      },

      // ─── Certificates ──────────────────────────────
      addCertificate: (cert) => {
        set((s) => ({ certificates: [...s.certificates, cert], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateCertificate: (id, data) => {
        set((s) => ({
          certificates: s.certificates.map((c) => (c.id === id ? { ...c, ...data } : c)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeCertificate: (id) => {
        set((s) => ({
          certificates: s.certificates.filter((c) => c.id !== id),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },

      // ─── Projects ──────────────────────────────────
      addProject: (proj) => {
        set((s) => ({ projects: [...s.projects, proj], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateProject: (id, data) => {
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeProject: (id) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },

      // ─── Job Posting & Cover Letter ────────────────
      setJobPosting: (data) => {
        set({ jobPosting: data, lastSaved: new Date() });
        triggerAutosave(get);
      },
      setCoverLetter: (data) => {
        set({ coverLetter: data, lastSaved: new Date() });
        triggerAutosave(get);
      },
      setCoverLetterMeta: (data) => {
        set({ coverLetterMeta: data, lastSaved: new Date() });
        triggerAutosave(get);
      },

      // ─── Document Selection & Layout ────────────────
      setDocumentSelection: (data) => {
        set((state) => ({
          documentSelection: { ...state.documentSelection, ...data },
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      setLayoutConfig: (data) => {
        set((state) => ({
          layoutConfig: { ...state.layoutConfig, ...data },
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },

      // ─── Attachments ───────────────────────────────
      addAttachment: (att) => {
        set((s) => ({ attachments: [...s.attachments, att], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateAttachment: (id, data) => {
        set((s) => ({
          attachments: s.attachments.map((a) => (a.id === id ? { ...a, ...data } : a)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeAttachment: (id) => {
        set((s) => ({
          attachments: s.attachments.filter((a) => a.id !== id),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      reorderAttachments: (from, to) => {
        set((s) => ({
          attachments: reorder(s.attachments, from, to),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },

      // ─── Export Config & Tracker ─────────────────
      setExportConfig: (data) => {
        set((state) => ({
          exportConfig: { ...state.exportConfig, ...data },
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      addTrackerEntry: (entry) => {
        set((s) => ({ trackerEntries: [...s.trackerEntries, entry], lastSaved: new Date() }));
        triggerAutosave(get);
      },
      updateTrackerEntry: (id, data) => {
        set((s) => ({
          trackerEntries: s.trackerEntries.map((e) => (e.id === id ? { ...e, ...data } : e)),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },
      removeTrackerEntry: (id) => {
        set((s) => ({
          trackerEntries: s.trackerEntries.filter((e) => e.id !== id),
          lastSaved: new Date(),
        }));
        triggerAutosave(get);
      },

      // ─── Navigation ────────────────────────────
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        })),
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      // ─── Import ────────────────────────────────────
      importApplicationData: (data: ApplicationImportData) => {
        set({
          personalData: data.personalData,
          workExperience: data.workExperience ?? [],
          education: data.education ?? [],
          skills: data.skills ?? [],
          languages: data.languages ?? [],
          certificates: data.certificates ?? [],
          projects: data.projects ?? [],
          jobPosting: data.jobPosting ?? null,
          coverLetter: data.coverLetter ?? null,
          coverLetterMeta: data.coverLetterMeta ?? null,
          attachments: (data.attachments ?? []).map((a) => ({ ...a, blob: undefined })),
          currentStep: 1,
          lastSaved: new Date(),
          isValid: true,
        });
        // Persist imported data immediately
        get().saveToIndexedDB();
      },

      // ─── Reset ─────────────────────────────────────
      resetApplication: () => {
        set({
          currentStep: 1,
          applicationName: "",
          personalData: defaultPersonalData,
          workExperience: [],
          education: [],
          skills: [],
          languages: [],
          certificates: [],
          projects: [],
          jobPosting: null,
          coverLetter: null,
          coverLetterMeta: null,
          attachments: [],
          documentSelection: defaultDocumentSelection,
          layoutConfig: defaultLayoutConfig,
          exportConfig: defaultExportConfig,
          trackerEntries: [],
          lastSaved: null,
          isValid: false,
        });
      },

      // ─── Persistence ───────────────────────────────
      saveToIndexedDB: async () => {
        const state = get();
        await applicationDb.applications.put({
          id: "current",
          data: {
            applicationName: state.applicationName,
            personalData: state.personalData,
            workExperience: state.workExperience,
            education: state.education,
            skills: state.skills,
            languages: state.languages,
            certificates: state.certificates,
            projects: state.projects,
            jobPosting: state.jobPosting,
            coverLetter: state.coverLetter,
            coverLetterMeta: state.coverLetterMeta,
            documentSelection: state.documentSelection,
            layoutConfig: state.layoutConfig,
            exportConfig: state.exportConfig,
            trackerEntries: state.trackerEntries,
          },
          updatedAt: new Date(),
        });
      },
    }),
    {
      name: "application-storage",
      version: 2,
      onRehydrateStorage: () => (state) => {
        if (state?.lastSaved && typeof state.lastSaved === "string") {
          state.lastSaved = new Date(state.lastSaved);
        }
      },
    },
  ),
);
