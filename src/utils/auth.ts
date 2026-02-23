import type { Session } from "../types/index";

const KEY = "intucate_session";

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}

export function validateLogin(email: string, password: string): string | null {
  if (!email.endsWith("@intucate.com")) {
    return "Only @intucate.com email addresses are permitted.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}
