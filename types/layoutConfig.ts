export type TemplateId = "classic" | "modern" | "creative" | "tech" | "executive" | "academic";
export type FontFamily = "Inter" | "Roboto" | "Merriweather" | "Open Sans" | "Lato";
export type PhotoPosition = "top-right" | "top-left" | "sidebar";
export type HeaderStyle = "centered" | "left-aligned" | "minimal";

export interface LayoutConfig {
  templateId: TemplateId;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: FontFamily;
  fontSize: number; // 10-14
  headerStyle: HeaderStyle;
  photoPosition: PhotoPosition;
  showPhoto: boolean;
}
