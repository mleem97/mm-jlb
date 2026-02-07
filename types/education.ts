export type EducationType =
  | "Promotion"
  | "Master"
  | "Bachelor"
  | "Ausbildung"
  | "Abitur"
  | "Mittlere Reife"
  | "Hauptschulabschluss"
  | "Sonstiges";

export interface Education {
  id: string;
  type: EducationType;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}
