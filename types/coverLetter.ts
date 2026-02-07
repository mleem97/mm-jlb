export type CoverLetterMode = "ai" | "manual";
export type CoverLetterTonality = "formell" | "modern-professionell" | "kreativ";

export interface CoverLetterGenerationParams {
  motivation?: string;
  strengths?: string;
  specialQualification?: string;
  tonality?: CoverLetterTonality;
}

export interface CoverLetter {
  mode: CoverLetterMode;
  introduction: string;
  mainBody: string;
  closing: string;
  fullText?: string;
  generationParams?: CoverLetterGenerationParams;
}

export interface CoverLetterMeta {
  entryDate?: string;
  salaryExpectation?: string;
  noticePeriod?: string;
}
