"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useLocaleStore, Locale } from "@/store/useLocaleStore";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import ar from "@/locales/ar.json";

const dictionaries: Record<Locale, Record<string, Record<string, string>>> = {
  en,
  fr,
  ar,
};

type I18nContextType = {
  t: (key: string, namespace?: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
});

export const useTranslation = () => useContext(I18nContext);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useLocaleStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  if (!mounted) {
    return null; // Prevent hydration errors initially
  }

  const t = (key: string, namespace: string = "editor") => {
    try {
      return dictionaries[locale][namespace][key] || key;
    } catch {
      return key;
    }
  };

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
}
