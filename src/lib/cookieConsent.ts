export type CookieConsentChoice = "essential" | "functional";

export const COOKIE_CONSENT_EVENT = "gtbs-cookie-consent-change";

const COOKIE_CONSENT_STORAGE_KEY = "gtbs-cookie-consent";
const COOKIE_CONSENT_COOKIE_NAME = "gtbs_cookie_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export function getCookieConsentSnapshot(): CookieConsentChoice | null {
  const storedChoice = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

  if (storedChoice === "essential" || storedChoice === "functional") {
    return storedChoice;
  }

  const cookieChoice = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_CONSENT_COOKIE_NAME}=`))
    ?.split("=")[1];

  return cookieChoice === "essential" || cookieChoice === "functional"
    ? cookieChoice
    : null;
}

export function subscribeToCookieConsent(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function saveCookieConsent(choice: CookieConsentChoice) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${choice};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;

  if (choice === "essential") {
    window.localStorage.setItem("gtbs-language", "en");
    const expiredGoogleCookie =
      "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax";
    document.cookie = expiredGoogleCookie;

    if (window.location.hostname !== "localhost") {
      document.cookie = `${expiredGoogleCookie};domain=${window.location.hostname}`;
    }

    window.dispatchEvent(new Event("gtbs-language-change"));
  }

  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
