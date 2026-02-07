export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate: string;
  endDate?: string;
  technologies: string[];
  role?: string;
}
