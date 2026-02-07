export interface WorkExperience {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string; // YYYY-MM format
  endDate?: string; // YYYY-MM format, undefined if current
  isCurrentJob: boolean;
  location?: string;
  tasks: string[];
  achievements: string[];
  description?: string;
}
