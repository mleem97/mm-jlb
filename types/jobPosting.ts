export type JobSource =
  | "website"
  | "linkedin"
  | "indeed"
  | "stepstone"
  | "empfehlung"
  | "sonstiges";

export interface JobPosting {
  companyName: string;
  companyAddress?: {
    street?: string;
    zip?: string;
    city?: string;
  };
  contactPerson?: string;
  jobTitle: string;
  referenceNumber?: string;
  source?: JobSource;
  jobDescriptionText?: string;
}
