export interface FontSpec {
  name: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
  script: "latin" | "arabic";
}

export const LATIN_FONTS: FontSpec[] = [
  { name: "Inter", category: "sans-serif", script: "latin" },
  { name: "Roboto", category: "sans-serif", script: "latin" },
  { name: "Open Sans", category: "sans-serif", script: "latin" },
  { name: "Montserrat", category: "sans-serif", script: "latin" },
  { name: "Lora", category: "serif", script: "latin" },
  { name: "Merriweather", category: "serif", script: "latin" },
  { name: "Playfair Display", category: "display", script: "latin" },
  { name: "Pacifico", category: "handwriting", script: "latin" }
];

export const ARABIC_FONTS: FontSpec[] = [
  { name: "Cairo", category: "sans-serif", script: "arabic" },
  { name: "Tajawal", category: "sans-serif", script: "arabic" },
  { name: "Almarai", category: "sans-serif", script: "arabic" },
  { name: "Amiri", category: "serif", script: "arabic" },
  { name: "Changa", category: "display", script: "arabic" },
  { name: "Reem Kufi", category: "display", script: "arabic" },
  { name: "Aref Ruqaa", category: "handwriting", script: "arabic" }
];

export const ALL_FONTS = [...LATIN_FONTS, ...ARABIC_FONTS];

/**
 * Dynamically injects a Google Font into the document head
 */
export const loadFont = (fontName: string) => {
  if (typeof window === "undefined") return;

  const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  
  // Don't inject if it's already there
  if (document.getElementById(fontId)) return;

  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;700&display=swap`;
  
  document.head.appendChild(link);
};
