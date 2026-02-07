import type { WorkExperience } from "./workExperience";
import type { Education } from "./education";
import type { Skill, Language } from "./skills";
import type { Certificate } from "./certificate";
import type { Project } from "./project";
import type { JobPosting } from "./jobPosting";
import type { CoverLetter, CoverLetterMeta } from "./coverLetter";
import type { Attachment } from "./attachment";
import type { DocumentSelection } from "./documentSelection";
import type { LayoutConfig } from "./layoutConfig";
import type { ExportConfig, TrackerEntry } from "./exportConfig";

export interface PersonalAddress {
  street: string;
  zip: string;
  city: string;
  country: string;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: PersonalAddress;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  photo?: string;
}

export interface ApplicationState {
  currentStep: number;
  totalSteps: number;
  applicationName: string;
  personalData: PersonalData;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  projects: Project[];
  jobPosting: JobPosting | null;
  coverLetter: CoverLetter | null;
  coverLetterMeta: CoverLetterMeta | null;
  attachments: Attachment[];
  documentSelection: DocumentSelection;
  layoutConfig: LayoutConfig;
  exportConfig: ExportConfig;
  trackerEntries: TrackerEntry[];
  lastSaved: Date | null;
  isValid: boolean;
}
