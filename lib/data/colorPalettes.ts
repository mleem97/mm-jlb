export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
}

export const colorPalettes: ColorPalette[] = [
  { name: "Klassisch Blau", primary: "#1a365d", secondary: "#e2e8f0" },
  { name: "Smaragd", primary: "#065f46", secondary: "#d1fae5" },
  { name: "Bordeaux", primary: "#7f1d1d", secondary: "#fecaca" },
  { name: "Anthrazit", primary: "#374151", secondary: "#f3f4f6" },
  { name: "Ozean", primary: "#0e7490", secondary: "#cffafe" },
  { name: "Aubergine", primary: "#581c87", secondary: "#f3e8ff" },
  { name: "Waldgrün", primary: "#166534", secondary: "#dcfce7" },
  { name: "Mitternacht", primary: "#1e1b4b", secondary: "#e0e7ff" },
];
