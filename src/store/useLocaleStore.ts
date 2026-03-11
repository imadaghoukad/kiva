import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "en" | "fr" | "ar";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      dir: "ltr",
      setLocale: (newLocale) => set({ 
        locale: newLocale,
        dir: newLocale === "ar" ? "rtl" : "ltr"
      }),
    }),
    {
      name: "postcanvas-locale-storage",
    }
  )
);
