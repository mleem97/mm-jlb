import type { PersonalData } from "./application";
import type { WorkExperience } from "./workExperience";
import type { Education } from "./education";
import type { Skill, Language } from "./skills";
import type { Certificate } from "./certificate";
import type { Project } from "./project";
import type { JobPosting } from "./jobPosting";
import type { CoverLetter, CoverLetterMeta } from "./coverLetter";
import type { Attachment } from "./attachment";

/**
 * The full application data structure used for JSON import/export.
 * Attachments in this type omit the `blob` field — binary data
 * is handled separately (e.g., in ZIP exports).
 */
export interface ApplicationImportData {
  version: string;
  exportedAt?: string;
  personalData: PersonalData;
  workExperience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  certificates?: Certificate[];
  projects?: Project[];
  jobPosting?: JobPosting;
  coverLetter?: CoverLetter;
  coverLetterMeta?: CoverLetterMeta;
  attachments?: Omit<Attachment, "blob">[];
}
