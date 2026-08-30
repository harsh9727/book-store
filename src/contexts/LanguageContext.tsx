"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type AppLanguage = "en" | "gu";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

interface GoogleTranslateWindow extends Window {
  google?: {
    translate?: {
      TranslateElement?: new (
        options: {
          pageLanguage: string;
          includedLanguages: string;
          autoDisplay: boolean;
        },
        elementId: string
      ) => unknown;
    };
  };
  googleTranslateElementInit?: () => void;
}

const LANGUAGE_STORAGE_KEY = "gtbs-language";
const LANGUAGE_CHANGE_EVENT = "gtbs-language-change";
const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";
const LEGACY_CONSENT_STORAGE_KEY = "gtbs-cookie-consent";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getLanguageSnapshot(): AppLanguage {
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  const hasGujaratiCookie = document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === "googtrans=/en/gu");

  return savedLanguage === "gu" || hasGujaratiCookie ? "gu" : "en";
}

function subscribeToLanguageChange(callback: () => void) {
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getTranslateSelect() {
  return document.querySelector<HTMLSelectElement>(".goog-te-combo");
}

function applyGujaratiTranslation() {
  const select = getTranslateSelect();

  if (!select) {
    return false;
  }

  select.value = "gu";
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function setGujaratiCookie() {
  document.cookie = "googtrans=/en/gu;path=/;SameSite=Lax";
}

function clearGujaratiCookie() {
  const expiredCookie =
    "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax";
  document.cookie = expiredCookie;

  if (window.location.hostname !== "localhost") {
    document.cookie = `${expiredCookie};domain=${window.location.hostname}`;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const language = useSyncExternalStore(
    subscribeToLanguageChange,
    getLanguageSnapshot,
    (): AppLanguage => "en"
  );

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;

    if (nextLanguage === "gu") {
      setGujaratiCookie();
      applyGujaratiTranslation();
      window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
      return;
    }

    clearGujaratiCookie();
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
    window.location.reload();
  }, []);

  useEffect(() => {
    window.localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
    document.cookie =
      "gtbs_cookie_consent=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax";
  }, []);

  useEffect(() => {
    if (language !== "gu") {
      return;
    }

    const translateWindow = window as GoogleTranslateWindow;

    const initializeTranslateElement = () => {
      const TranslateElement = translateWindow.google?.translate?.TranslateElement;
      const container = document.getElementById("google_translate_element");

      if (TranslateElement && container && !container.hasChildNodes()) {
        new TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,gu",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }

      if (getLanguageSnapshot() === "gu") {
        window.setTimeout(applyGujaratiTranslation, 250);
      }
    };

    translateWindow.googleTranslateElementInit = initializeTranslateElement;

    if (translateWindow.google?.translate?.TranslateElement) {
      initializeTranslateElement();
      return;
    }

    if (!document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;

    if (language !== "gu") {
      return;
    }

    setGujaratiCookie();
    const timer = window.setTimeout(applyGujaratiTranslation, 350);
    return () => window.clearTimeout(timer);
  }, [language, pathname]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div
        id="google_translate_element"
        className="notranslate hidden"
        translate="no"
        aria-hidden="true"
      />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
