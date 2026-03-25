export interface AuthUser {
  clientId: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

const AUTH_STORAGE_KEY = "navigaid_user";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || typeof parsed.clientId !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthClientId() {
  return getStoredUser()?.clientId ?? null;
}

export function requireAuth() {
  if (!getStoredUser()) {
    window.location.href = "/login";
  }
}
